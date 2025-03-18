<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Redirect;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssignPermissionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role as UserRole;

class UserPermissionController extends Controller
{
     public function store(Request $request): RedirectResponse
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        } 
        
        $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:permissions,name', 'regex:/^\S*$/'],
            ],
            [
                'name.regex' => 'The name field cannot contain spaces.',
            ]
        );

        Permission::create([
            'name' => $request->name,
            'guard_name' => 'admin'
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        }  

         $request->validate([
                'name' => ['required', 'string', 'max:255', 'regex:/^\S*$/', 'unique:permissions,name,' . $permission->id],
            ],
            [
                'name.regex' => 'The name field cannot contain spaces.',
            ]
        );

        $permission->update([
            'name' => $request->name,
        ]);

        return redirect()->back();
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        }  

        $permission->delete();

        return redirect()->back();
    }

    public function assignPermission(AssignPermissionRequest $request)
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        } 

        $role = UserRole::findOrFail($request->role_id);

        $role->givePermissionTo($request->permissions);

        return redirect()->back();
    }

    public function removePermission(Request $request)
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        }  

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
        })
        ->get()
        ->sortBy(function ($permission) {
            return strpos($permission, 'order') !== false ? 1 : (strpos($permission, 'user') !== false ? 2 : 3);
        })->values();

        // Only get permissions that are already assigned to the role
        $hasPermissions = Permission::whereHas('roles', function ($query) use ($role) {
            $query->where('role_id', $role->id);
        })->get();

        return response()->json([
            'permissions' => $permissions,
            'hasPermissions' => $hasPermissions,
        ]);
    }

    private function cannot(string $operation): bool
    {
        return Gate::forUser(Auth::guard('admin')->user())->denies($operation, Permission::class);
    }
}
