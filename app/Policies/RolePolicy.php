<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function viewAny(Admin $admin): bool
    {        
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('view_roles')) {
            return false;
        }

        return $admin->hasPermissionTo('view_roles');
    }

    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_role')) {
            return false;
        }
        
        return $admin->hasPermissionTo('create_role');
    }

    public function update(Admin $admin, Role $role): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('update_role')) {
            return false;
        }

       return $admin->hasPermissionTo('update_role');
    }

    public function delete(Admin $admin, Role $role): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_role')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_role');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
