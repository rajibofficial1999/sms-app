<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Order;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    public function updateStatus(Admin $admin, Order $order): bool
    {
       return $admin->hasPermissionTo('update order status');
    }

    public function delete(Admin $admin, Order $order): bool
    {
        return $admin->hasPermissionTo('delete order');
    }

    public function approveNewOrder(Admin $admin, Order $order): bool
    {
        return $admin->hasPermissionTo('approve new order');
    }
}
