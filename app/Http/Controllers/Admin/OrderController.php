<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Status;
use App\Enums\SubscriptionPeriod;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PhoneNumber;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{

     public function index(): Response
    {
        $orders = Order::with('user.phoneNumber', 'paymentMethod')->latest()->paginate(10);

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
        ]);
    }
    

    public function destroy(Order $order): RedirectResponse 
    {
        if (Storage::disk('public')->exists($order->payment_screenshot)) {
            Storage::disk('public')->delete($order->payment_screenshot);
        }

       $order->delete();

       return redirect()->back();
    }

    public function update(Request $request, Order $order): RedirectResponse 
    {
        $request->validate([
            'status' => ['required', new Enum(Status::class)],
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        if($order->status === Status::COMPLETED) {
            $this->createOrUpdateSubscription($order);
        }

        return redirect()->back();
    }

    public function search(Request $request): JsonResponse
    {
        $search = $request->key;

        $orders = Order::with('user.phoneNumber', 'paymentMethod')->whereHas('user', function($query) use ($search) {
            $query->where('name', 'like', "%$search%");
        })->latest()->paginate(10);

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function filter(Request $request): JsonResponse
    {
          $request->validate([
            'status' => ['required', new Enum(Status::class)],
        ]);

        $status = $request->status;

        $orders = Order::with('user.phoneNumber', 'paymentMethod')->whereStatus($status)->latest()->paginate(10);

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function approveNewOrder(Request $request, Order $order)
    {
        $request->validate([
            'phone' => 'required|string|max:255',
        ]);

        $phoneNumber = PhoneNumber::where('user_id', $order->user_id)->first();
        if($phoneNumber) {
            throw ValidationException::withMessages([
                'phone' => 'User already has a phone number',
            ]);
        }
        
        PhoneNumber::create([
            'user_id' => $order->user_id,
            'number' => $request->phone,
        ]);

        $order->update([
            'status' => Status::COMPLETED,
        ]);

        Order::whereStatus(Status::PENDING)->delete();

        $this->createOrUpdateSubscription($order);

        return redirect()->back();
    }

    private function createOrUpdateSubscription(Order $order): void
    {
        if($order->period === SubscriptionPeriod::MONTHLY) {
            $expired_at = now()->addMonth();
        }else if($order->period === SubscriptionPeriod::WEEKLY) {
            $expired_at = now()->addWeek();
        }

        Subscription::updateOrCreate([
            'user_id'   => $order->user_id,
            ], 
            [
                'expired_at' => $expired_at,
                'status' => Status::COMPLETED,
                'payment_method_id' => $order->payment_method_id,
            ]
        );
    }
}
