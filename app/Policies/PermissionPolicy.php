<?php

namespace App\Policies;

use App\Models\Admin;
use Spatie\Permission\Models\Permission;

class PermissionPolicy
{
    public function manageRolesPermissions(Admin $admin): bool
    {
        if($admin->hasRole('Super admin')){
            return true;
        }

        if (!$this->permisionTableExists('manage_roles_and_permissions')) {
            return false;
        }

        return $admin->hasPermissionTo('manage_roles_and_permissions');
    }

    private function permisionTableExists(string $name): bool
    {
        return Permission::where('name', $name)->where('guard_name', 'admin')->exists();
    }
}
