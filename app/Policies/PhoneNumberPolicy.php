<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\PhoneNumber;
use Illuminate\Auth\Access\Response;


class PhoneNumberPolicy
{
    public function create(Admin $admin): bool
    {
        return $admin->hasPermissionTo('create phone number');
    }

    public function update(Admin $admin, PhoneNumber $phoneNumber): bool
    {
       return $admin->hasPermissionTo('update phone number');
    }

    public function delete(Admin $admin, PhoneNumber $phoneNumber): bool
    {
        return $admin->hasPermissionTo('delete phone number');
    }

    public function status(Admin $admin, PhoneNumber $phoneNumber): bool
    {
        return $admin->hasPermissionTo('change phone number status');
    }
}
