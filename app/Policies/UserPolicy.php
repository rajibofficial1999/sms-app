<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function delete(Admin $admin, User $user): bool
    {
        return $admin->hasPermissionTo('delete user');
    }

    public function status(Admin $admin, User $user): bool
    {
        return $admin->hasPermissionTo('change user status');
    }
}
