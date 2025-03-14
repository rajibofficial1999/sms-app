<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;

class PermissionPolicy
{
    public function create(Admin $admin): bool
    {
        return $admin->hasPermissionTo('create permission');
    }

    public function update(Admin $admin, Permission $permission): bool
    {
       return $admin->hasPermissionTo('update permission');
    }

    public function delete(Admin $admin, Permission $permission): bool
    {
        return $admin->hasPermissionTo('delete permission');
    }
}
