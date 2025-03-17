<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;

class AppSettingPolicy
{
    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_app_setting')) {
            return false;
        }

        return $admin->hasPermissionTo('create_app_setting');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}