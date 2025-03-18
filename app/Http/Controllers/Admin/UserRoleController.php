<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Redirect;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role as UserRole;
use Inertia\Inertia;
use Inertia\Response;

class UserRoleController extends Controller
{
    public function index(): Response | RedirectResponse
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        } 
        
        $roles = UserRole::whereNot('name', 'Super admin')->get();

        $permissions = Permission::orderBy('name')->get()->sortBy(function ($permission) {
            return strpos($permission, 'order') !== false ? 1 : (strpos($permission, 'user') !== false ? 2 : 3);
        })->values();
        
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    } 
    
    public function store(Request $request)
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        } 

        $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:roles,name', 'regex:/^\S*$/'],
            ],
            [
                'name.regex' => 'The name field cannot contain spaces.',
            ]
        );

        UserRole::create([
            'name' => $request->name,
            'guard_name' => 'admin'
        ]);

        return redirect()->route('admin.roles.index');
    }

    public function update(Request $request, UserRole $role): RedirectResponse
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        } 

        $request->validate([
                'name' => ['required', 'string', 'max:255', 'regex:/^\S*$/', 'unique:roles,name,' . $role->id],
            ],
            [
                'name.regex' => 'The name field cannot contain spaces.',
            ]
        );

        $role->update([
            'name' => $request->name,
        ]);

        return redirect()->back();
    }

    public function destroy(UserRole $role): RedirectResponse
    {
        if ($this->cannot('manageRolesPermissions')) {
            return Redirect::unauthorized();
        } 

        $role->delete();

        return redirect()->back();
    }

    private function cannot(string $operation): bool
    {
        return Gate::forUser(Auth::guard('admin')->user())->denies($operation, UserRole::class);
    }
}
