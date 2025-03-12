<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{

    public function store(OrderStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['payment_method_id'] = $request->payment_method; 
        unset($validated['payment_method']);

        if(! $request->area_code){
            $validated['is_renewal'] = true;
        }

        if($request->hasFile('payment_screenshot')) {
            $paymentScreenshot = $request->file('payment_screenshot');
            $validated['payment_screenshot'] = $paymentScreenshot->store('images/screenshots', 'public');
        }

        $user = Auth::user();

        $user->orders()->create($validated);

        return redirect()->route('dashboard');
    }
}
