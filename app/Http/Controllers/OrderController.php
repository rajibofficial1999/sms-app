<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{

    public function store(OrderStoreRequest $request): RedirectResponse
    {
        $screenshotPath = '';
        if($request->hasFile('payment_screenshot')) {
            $paymentScreenshot = $request->file('payment_screenshot');
            $screenshotPath = $paymentScreenshot->store('images/screenshots', 'public');
        }

        $user = Auth::user();

        Order::create([
            'account_holder_name' => $request->account_holder_name,
            'payment_method_id' => $request->payment_method,
            'payment_screenshot' => $screenshotPath,
            'period' => $request->period,
            'user_id' => $user->id,
        ]);

        return redirect()->route('dashboard');
    }
}
