<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Order;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;

class OrderPolicy
{
    public function viewAny(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('view_orders')) {
            return false;
        }

        return $admin->hasPermissionTo('view_orders');
    }

    public function updateStatus(Admin $admin, Order $order): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('change_order_status')) {
            return false;
        }

       return $admin->hasPermissionTo('change_order_status');
    }

    public function delete(Admin $admin, Order $order): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_order')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_order');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
