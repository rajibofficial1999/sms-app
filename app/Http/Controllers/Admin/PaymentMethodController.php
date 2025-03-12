<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentAccountTypes;
use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function index(): Response
    {
        $paymentMethods = PaymentMethod::latest()->paginate(10);
        
        return Inertia::render('Admin/PaymentMethod/Index',[
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PaymentMethod/Create', [
            'accountTypes' => PaymentAccountTypes::cases()
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255|unique:payment_methods,type',
            'account_number' => 'required|numeric|max_digits:50|min_digits:10',
            'account_type' => ['required', new Enum(PaymentAccountTypes::class)],
            'logo' => 'required|mimes:png,jpg',
        ]);
          

        if($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $validated['logo'] = $logo->store('images/paymenttypes', 'public');
        }  
        
        PaymentMethod::create($validated); 
        
        return redirect()->route('admin.payment-methods.index');
    }

    public function edit(PaymentMethod $paymentMethod)
    {        
        return Inertia::render('Admin/PaymentMethod/Edit',[
            'accountTypes' => PaymentAccountTypes::cases(),
            'paymentMethod' => $paymentMethod,
        ]);
    }

    public function update(Request $request, PaymentMethod $paymentMethod): RedirectResponse
    {

        $validated = $request->validate([
            'type' => ['required', 'string', 'max:255', Rule::unique('payment_methods')->ignore($paymentMethod->id)],
            'account_number' => 'required|numeric|max_digits:50|min_digits:10',
            'account_type' => ['required', new Enum(PaymentAccountTypes::class)],
            'logo' => 'nullable|mimes:png,jpg',
        ]);

        if($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $validated['logo'] = $logo->store('images/paymenttypes', 'public');
        }else{
            unset($validated['logo']);
        }
                
        $paymentMethod->update($validated); 
        
        return redirect()->route('admin.payment-methods.index');
    }

    public function toggleStatus(PaymentMethod $paymentMethod): RedirectResponse
    {        
       $paymentMethod->update([
            'status' => !$paymentMethod->status,
        ]);

       return redirect()->back();
    }

    
    public function destroy(PaymentMethod $paymentMethod): RedirectResponse
    {
        if (Storage::disk('public')->exists($paymentMethod->logo)) {
            Storage::disk('public')->delete($paymentMethod->logo);
        }

       $paymentMethod->delete();

       return redirect()->back();
    }

    public function search(Request $request): JsonResponse
    {
        $search = $request->key;

        $paymentMethods = PaymentMethod::where('type', 'like', "%$search%")->paginate(10);

        return response()->json([
            'paymentMethods' => $paymentMethods,
        ]);
    }
}
