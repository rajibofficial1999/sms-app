<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionPeriod;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response | RedirectResponse
    {
        $subscription = Auth::user()->subscription;

        if (!$subscription) {
            return redirect()->route('pricing');
        }

        return Inertia::render('Billings', [
            'subscription' => $subscription->load('paymentMethod'),
        ]);
    }

    public function checkout(): Response
    {
        $period = request()->input('period');

        abort_if(!SubscriptionPeriod::tryFrom($period), 404);

        $details = SubscriptionPeriod::from($period)->details();
        $details['period'] = $period;   

        $paymentMethods = PaymentMethod::active()->get();

        return Inertia::render('Checkout/Index', [
            'package' => $details,
            'paymentMethods' => $paymentMethods,
            'userPhoneNumber' => Auth::user()->phoneNumber()->active()->first(),
        ]);
    }
}
