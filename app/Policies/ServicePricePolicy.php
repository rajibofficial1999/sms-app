<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;

class ServicePricePolicy
{
    public function create(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('create_service_price')) {
            return false;
        }

        return $admin->hasPermissionTo('create_service_price');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
