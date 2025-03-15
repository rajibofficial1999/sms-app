<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;

class UserPolicy
{
    public function viewAny(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

       if (!$this->permisionTableExists('view_users')) {
            return false;
        }

        return $admin->hasPermissionTo('view_users');
    }

    public function delete(Admin $admin, User $user): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_user')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_user');
    }

    public function status(Admin $admin, User $user): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }
        
        if (!$this->permisionTableExists('change_user_status')) {
            return false;
        }

        return $admin->hasPermissionTo('change_user_status');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
