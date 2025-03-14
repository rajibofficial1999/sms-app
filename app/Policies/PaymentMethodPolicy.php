<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\PaymentMethod;
use Illuminate\Auth\Access\Response;

class PaymentMethodPolicy
{
    
    public function create(Admin $admin): bool
    {
        return $admin->hasPermissionTo('create payment method');
    }

    public function update(Admin $admin, PaymentMethod $paymentMethod): bool
    {
       return $admin->hasPermissionTo('update payment method');
    }

    public function delete(Admin $admin, PaymentMethod $paymentMethod): bool
    {
        return $admin->hasPermissionTo('delete payment method');
    }

    public function status(Admin $admin, PaymentMethod $paymentMethod): bool
    {
        return $admin->hasPermissionTo('change payment method status');
    }
}
