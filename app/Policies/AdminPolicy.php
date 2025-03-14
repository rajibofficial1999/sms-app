<?php

namespace App\Policies;

use App\Models\Admin;
use Illuminate\Auth\Access\Response;

class AdminPolicy
{
    public function create(Admin $admin): bool
    {
        return $admin->hasPermissionTo('create admin user');
    }

    public function update(Admin $admin, Admin $model): bool
    {
       return $admin->hasPermissionTo('update admin user');
    }

    public function delete(Admin $admin, Admin $model): bool
    {
        return $admin->hasPermissionTo('delete admin user');
    }

    public function status(Admin $admin, Admin $model): bool
    {
        return $admin->hasPermissionTo('change admin user status');
    }
}
