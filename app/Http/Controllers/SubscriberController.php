<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function subscribe(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'unique:subscribers'],
        ]);

        Subscriber::create([
            'email' => $request->email,
        ]);

        return redirect()->back();
    }

    public function unsubscribe(string $email): RedirectResponse
    {
        $subscriber = Subscriber::where('email', $email)->first();

        if (!$subscriber) {
            abort(404);
        }

        $subscriber->delete();

        return redirect()->route('home');
    }
}
