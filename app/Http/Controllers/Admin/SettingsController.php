<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageProvider;
use App\Helpers\Redirect;
use App\Http\Controllers\Controller;
use App\Models\ActiveProvider;
use App\Models\AppSetting;
use App\Models\ServicePrice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response | RedirectResponse
    {    
        if (Gate::forUser(Auth::guard('admin')->user())->denies('manageAppSettings', AppSetting::class)) {
            return Redirect::unauthorized();
        } 

        return Inertia::render('Admin/Settings/Edit', [
            'app_settings' => AppSetting::query()->first(),
            'service_prices' => ServicePrice::query()->first(),
            'providers' => MessageProvider::cases(),
            'active_provider' => ActiveProvider::active()->first()
        ]);
    }

    public function updateAppSettings(Request $request): RedirectResponse
    { 
        $request->validate([
            'app_name' => ['required', 'string', 'max:255'],
            'app_description' => ['nullable', 'string', 'max:255'],
            'app_logo' => ['nullable', 'mimes:png,jpg'],
        ]);

        $appSetting = AppSetting::query()->first();

        if($request->hasFile('app_logo')) {
            $image = $request->file('app_logo');
            $imageUrl = $image->store('images/logo', 'public');

            if($appSetting){
                if (Storage::disk('public')->exists($appSetting->app_logo || '')) {
                    Storage::disk('public')->delete($appSetting->app_logo || '');
                }
            }
        }else{
            $imageUrl = $appSetting?->app_logo ?? null;
        }

        $data = [
            'app_name' => $request->app_name,
            'app_description' => $request->app_description,
            'app_logo' => $imageUrl,
        ];
        
        if(!$appSetting){
            $appSetting = AppSetting::create($data);
        }else{
            $appSetting->update($data);
        }

        return redirect()->back();
    }

    public function updateServicePrices(Request $request): RedirectResponse
    {
        if (Gate::forUser(Auth::guard('admin')->user())->denies('manageAppSettings', ServicePrice::class)) {
            return Redirect::unauthorized();
        } 

        $request->validate([
            'incoming_sms_price' => ['required', 'numeric'],
            'outgoing_sms_price' => ['required', 'numeric'],
            'incoming_mms_price' => ['required', 'numeric'],
            'outgoing_mms_price' => ['required', 'numeric'],
            'incoming_call_price' => ['required', 'numeric'],
            'outgoing_call_price' => ['required', 'numeric'],
        ]);
        
        $servicePrice = ServicePrice::query()->first();

        $data = [
            'incoming_sms_price' => $request->incoming_sms_price,
            'outgoing_sms_price' => $request->outgoing_sms_price,
            'incoming_mms_price' => $request->incoming_mms_price,
            'outgoing_mms_price' => $request->outgoing_mms_price,
            'incoming_call_price' => $request->incoming_call_price,
            'outgoing_call_price' => $request->outgoing_call_price,
        ];
        
        if(!$servicePrice){
            $servicePrice = ServicePrice::create($data);
        }else{
            $servicePrice->update($data);
        }

        return redirect()->back();
    } 

    public function setProvider(Request $request): RedirectResponse
    { 
        if (Gate::forUser(Auth::guard('admin')->user())->denies('manageAppSettings', AppSetting::class)) {
            return Redirect::unauthorized();
        } 

        $request->validate([
            'name' => ['required', 'string', new Enum(MessageProvider::class)],
        ]);
        
        $activeProvider = ActiveProvider::active()->first();

        if($activeProvider){
            $activeProvider->update([
                'name' => $request->name,
                'is_active' => true
            ]);
        }else{
            $activeProvider = ActiveProvider::create([
                'name' => $request->name,
                'is_active' => true
            ]);
        }

        return redirect()->back();
    }
}
