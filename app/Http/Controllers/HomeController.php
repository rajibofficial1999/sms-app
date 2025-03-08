<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home');
    }

    public function pricing()
    {
        $subscription = null;
        
        if(Auth::check()) {
            $subscription = Auth::user()->subscription;
        }
        
        return Inertia::render('Pricing', [
            'periods' => SubscriptionPeriod::allDetails(),
            'subscription' => $subscription,    
        ]);
    }
}
