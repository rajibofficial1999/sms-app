<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Status;
use App\Enums\SubscriptionPeriod;
use App\Helpers\Redirect;
use App\Http\Controllers\Controller;
use App\Jobs\ApproveOrderJob;
use App\Jobs\ChangeOrderStatusJob;
use App\Jobs\RejectOrderJob;
use App\Models\Order;
use App\Models\PhoneNumber;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(): Response | RedirectResponse
    {
        if ($this->cannot('viewAny')) {
            return Redirect::unauthorized();
        }  
        
        $orders = Order::query()
            ->leftJoin('payment_methods', 'payment_methods.id', '=', 'orders.payment_method_id')
            ->leftJoin('users', 'users.id', '=', 'orders.user_id')
            ->leftJoin('phone_numbers', 'phone_numbers.user_id', '=', 'users.id') 
            ->select(
                'orders.*', 
                'payment_methods.type as payment_method_name',
                'users.name as user_name',
                'phone_numbers.number as user_renewal_number'
            ) 
            ->latest('orders.created_at') 
            ->paginate(10);

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'statuses' => Status::cases(),
        ]);
    }
    

    public function destroy(Order $order): RedirectResponse 
    {
        if ($this->cannot('delete', $order)) {
            return Redirect::unauthorized();
        }  

        if (Storage::disk('public')->exists($order->payment_screenshot)) {
            Storage::disk('public')->delete($order->payment_screenshot);
        }

       $order->delete();

       return redirect()->back();
    }

    public function update(Request $request, Order $order): RedirectResponse 
    {
        if ($this->cannot('updateStatus', $order)) {
            return Redirect::unauthorized();
        }  

        $request->validate([
            'status' => ['required', new Enum(Status::class)],
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        if($order->status === Status::COMPLETED) {
            $Subscription = $this->createOrUpdateSubscription($order);

            Order::whereStatus(Status::PENDING)->where('user_id', $order->user_id)->update(['status' => Status::REJECTED]);

            ApproveOrderJob::dispatch($order, $Subscription);
        }else{
            RejectOrderJob::dispatch($order, 'invalid payment details');    
        }
        
        

        return redirect()->back();
    }

    public function search(?string $search = null): JsonResponse
    {
        $orders = Order::with('user.phoneNumber', 'paymentMethod')->when($search, function($query) use ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        })->latest()->paginate(10);

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function filter(?string $status = null): JsonResponse
    {
        $orders = Order::with('user.phoneNumber', 'paymentMethod')->when($status, function($query) use ($status) {
            $query->whereStatus($status);
        })->latest()->paginate(10);

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function approveNewOrder(Request $request, Order $order)
    {
        if ($this->cannot('updateStatus', $order)) {
            return Redirect::unauthorized();
        }

         $request->validate([
            'number' => ['required', 'string', 'max:255', 'phone:US', Rule::unique('phone_numbers')],
        ], [
            'number.phone' => 'Invalid phone number',
        ]);

        $phoneNumber = PhoneNumber::active()->where('user_id', $order->user_id)->first();

        if($phoneNumber) {
            throw ValidationException::withMessages([
                'number' => 'User already has a phone number',
            ]);
        }
        
        PhoneNumber::create([
            'user_id' => $order->user_id,
            'number' => $request->number,
            'area_code' => $order->area_code,
        ]);

        $order->update([
            'status' => Status::COMPLETED,
        ]);

        // Update subscription
        $this->createOrUpdateSubscription($order);

        // Delete inactive phone numbers
        PhoneNumber::inActive()->where('user_id', $order->user_id)->delete();

        // reject rest all pending orders of the user
        Order::whereStatus(Status::PENDING)->where('user_id', $order->user_id)->update(['status' => Status::REJECTED]);

        return redirect()->back();
    }

    private function createOrUpdateSubscription(Order $order): Subscription
    {
        if($order->period === SubscriptionPeriod::MONTHLY) {
            $expired_at = now()->addMonth();
        }else if($order->period === SubscriptionPeriod::WEEKLY) {
            $expired_at = now()->addWeek();
        }

        $Subscription = Subscription::updateOrCreate([
            'user_id'   => $order->user_id,
            ], 
            [
                'expired_at' => $expired_at,
                'status' => Status::COMPLETED,
                'payment_method_id' => $order->payment_method_id,
            ]
        );


        return $Subscription;
    }

    private function cannot(string $operation, ?Order $order = null): bool
    {
        if (!$order) {
            return Gate::forUser(Auth::guard('admin')->user())->denies($operation, Order::class);
        }

        return Gate::forUser(Auth::guard('admin')->user())->denies($operation, $order);
    }
}
