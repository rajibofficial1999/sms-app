<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Status;
use App\Enums\SubscriptionPeriod;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules\Enum;

class OrderController extends Controller
{

     public function index(): Response
    {
        $orders = Order::with('user', 'paymentMethod')->latest()->paginate(10);

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

        Order::whereStatus(Status::PENDING)->delete();

        return redirect()->back();
    }

    public function search(Request $request): JsonResponse
    {
        $search = $request->key;

        $orders = Order::whereHas('user', function($query) use ($search) {
            $query->where('name', 'like', "%$search%");
        })->paginate(10);

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

        $orders = Order::whereStatus($status)->paginate(10);

        return response()->json([
            'orders' => $orders,
        ]);
    }
}
