<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Http\Requests\OrderStoreRequest;
use App\Jobs\PlaceOrderJob;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{

    public function store(OrderStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['payment_method_id'] = $request->payment_method; 
        unset($validated['payment_method']);

        if($request->hasFile('payment_screenshot')) {
            $paymentScreenshot = $request->file('payment_screenshot');
            $validated['payment_screenshot'] = $paymentScreenshot->store('images/screenshots', 'public');
        }

        $user = Auth::user();

        $order = $user->orders()->create($validated);

        PlaceOrderJob::dispatch($user, $order);

        return redirect()->route('dashboard');
    }

    public function destroy(Order $order): RedirectResponse
    {
        if($order->status !== Status::COMPLETED) {
            if (Storage::disk('public')->exists($order->payment_screenshot)) {
                Storage::disk('public')->delete($order->payment_screenshot);
            }
            
            $order->delete();
        }

        return redirect()->back();
    }
}
