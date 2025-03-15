<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\PhoneNumber;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;

class PhoneNumberPolicy
{
    public function viewAny(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('view_phone_numbers')) {
            return false;
        }

        return $admin->hasPermissionTo('view_phone_numbers');
    }

    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_phone_number')) {
            return false;
        }

        return $admin->hasPermissionTo('create_phone_number');
    }

    public function update(Admin $admin, PhoneNumber $phoneNumber): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('update_phone_number')) {
            return false;
        }

       return $admin->hasPermissionTo('update_phone_number');
    }

    public function delete(Admin $admin, PhoneNumber $phoneNumber): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('delete_phone_number')) {
            return false;
        }

        return $admin->hasPermissionTo('delete_phone_number');
    }

    public function status(Admin $admin, PhoneNumber $phoneNumber): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }
        
        if (!$this->permisionTableExists('change_phone_number_status')) {
            return false;
        }

        return $admin->hasPermissionTo('change_phone_number_status');
    }
    
    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
