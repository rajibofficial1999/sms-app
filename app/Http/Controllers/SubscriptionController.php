<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionPeriod;
use App\Http\Requests\OrderStoreRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SubscriptionController extends Controller
{
    // : InertiaResponse | RedirectResponse
    public function index()
    {
        $subscription = Auth::user()->subscription;

        if (!$subscription) {
            return redirect()->route('pricing');
        }

        return Inertia::render('Billings', [
            'subscription' => $subscription->load('order.paymentMethod'),
        ]);
    }

    public function checkout(): InertiaResponse
    {
        $period = request()->input('period');

        abort_if(!SubscriptionPeriod::tryFrom($period), 404);

        $details = SubscriptionPeriod::from($period)->details();
        $details['period'] = $period;   

        $paymentMethods = PaymentMethod::active()->get();

        return Inertia::render('Checkout', [
            'package' => $details,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function store(OrderStoreRequest $request): RedirectResponse
    {
        $screenshotPath = '';
        if($request->hasFile('payment_screenshot')) {
            $paymentScreenshot = $request->file('payment_screenshot');
            $screenshotPath = Storage::disk('public')->putFile('images/screenshots',$paymentScreenshot);
        }


        $order = Auth::user()->orders()->create([
            'account_holder_name' => $request->account_holder_name,
            'payment_method_id' => $request->payment_method,
            'payment_screenshot' => $screenshotPath,
            'period' => $request->period,
        ]);

        if($request->period === SubscriptionPeriod::MONTHLY->value) {
            $expired_at = now()->addMonth();
        }else if($request->period === SubscriptionPeriod::WEEKLY->value) {
            $expired_at = now()->addWeek();
        }

        $order->subscription()->create([
            'user_id' => Auth::user()->id,
            'expired_at' => $expired_at,
        ]);

        return redirect()->route('billings');
    }
}
