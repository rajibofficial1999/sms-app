<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function create(Admin $admin): bool
    {
        return $admin->hasPermissionTo('create role');
    }

    public function update(Admin $admin, Role $role): bool
    {
       return $admin->hasPermissionTo('update role');
    }

    public function delete(Admin $admin, Role $role): bool
    {
        return $admin->hasPermissionTo('delete role');
    }
}
