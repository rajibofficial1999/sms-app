<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;

class AppSettingPolicy
{
    public function manageAppSettings(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('manage_app_settings')) {
            return false;
        }

        return $admin->hasPermissionTo('manage_app_settings');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}