<?php

namespace App\Policies;

use App\Models\Admin;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;

class AdminPolicy
{
    public function viewAny(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

       if (!$this->permisionTableExists('view_admin_users')) {
            return false;
        }

        return $admin->hasPermissionTo('view_admin_users');
    }

    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_admin_user')) {
            return false;
        }

        return $admin->hasPermissionTo('create_admin_user');
    }

    public function update(Admin $admin, Admin $model): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('update_admin_user')) {
            return false;
        }

       return $admin->hasPermissionTo('update_admin_user');
    }

    public function delete(Admin $admin, Admin $model): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_admin_user')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_admin_user');
    }

    public function status(Admin $admin, Admin $model): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }
        
        if (!$this->permisionTableExists('change_admin_user_status')) {
            return false;
        }

        return $admin->hasPermissionTo('change_admin_user_status');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
