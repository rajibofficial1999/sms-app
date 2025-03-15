<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;

class PermissionPolicy
{
    public function viewAny(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('view_permissions')) {
            return false;
        }

        return $admin->hasPermissionTo('view_permissions');
    }

    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_permission')) {
            return false;
        }

        return $admin->hasPermissionTo('create_permission');
    }

    public function update(Admin $admin, Permission $permission): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('update_permission')) {
            return false;
        }

       return $admin->hasPermissionTo('update_permission');
    }

    public function delete(Admin $admin, Permission $permission): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_permission')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_permission');
    }

    public function assignPermission(Admin $admin): bool    
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('assign_permission')) {
            return false;
        }

        return $admin->hasPermissionTo('assign_permission');
    }

    public function removeAssignedPermission(Admin $admin): bool    
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('removed_assigned_permission')) {
            return false;
        }

        return $admin->hasPermissionTo('removed_assigned_permission');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
