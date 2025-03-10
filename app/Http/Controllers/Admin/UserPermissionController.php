<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignPermissionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role as UserRole;

class UserPermissionController extends Controller
{
     public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        Permission::create([
            'name' => $request->name,
            'guard_name' => 'admin'
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        $permission->update([
            'name' => $request->name,
        ]);

        return redirect()->back();
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return redirect()->back();
    }

    public function assignPermission(AssignPermissionRequest $request)
    {
        $role = UserRole::findOrFail($request->role_id);

        $role->givePermissionTo($request->permissions);

        return redirect()->back();
    }

    public function removePermission(Request $request)
    {
        $request->validate([
            'permission' => ['required', 'integer', 'exists:permissions,id'],
            'role' => ['required', 'integer', 'exists:roles,id'],
        ]);

        $role = UserRole::find($request->role);
        $permission = Permission::find($request->permission);

        $role->revokePermissionTo($permission);

        return redirect()->back();
    }

    public function getPermissions(UserRole $role): JsonResponse
    {
        // Only get permissions that are not assigned to the role
        $permissions = Permission::whereDoesntHave('roles', function ($query) use ($role) {
            $query->where('role_id', $role->id);
        })->get();

        // Only get permissions that are already assigned to the role
        $hasPermissions = Permission::whereHas('roles', function ($query) use ($role) {
            $query->where('role_id', $role->id);
        })->get();

        return response()->json([
            'permissions' => $permissions,
            'hasPermissions' => $hasPermissions,
        ]);
    }
}
