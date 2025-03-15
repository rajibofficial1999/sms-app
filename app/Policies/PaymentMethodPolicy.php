<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\PaymentMethod;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;

class PaymentMethodPolicy
{
    
    public function viewAny(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('view_payment_methods')) {
            return false;
        }

        return $admin->hasPermissionTo('view_payment_methods');
    }

    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_payment_method')) {
            return false;
        }

        return $admin->hasPermissionTo('create_payment_method');
    }

    public function update(Admin $admin, PaymentMethod $paymentMethod): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('update_payment_method')) {
            return false;
        }

       return $admin->hasPermissionTo('update_payment_method');
    }

    public function delete(Admin $admin, PaymentMethod $paymentMethod): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_payment_method')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_payment_method');
    }

    public function status(Admin $admin, PaymentMethod $paymentMethod): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }
        
        if (!$this->permisionTableExists('change_payment_method_status')) {
            return false;
        }

        return $admin->hasPermissionTo('change_payment_method_status');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
