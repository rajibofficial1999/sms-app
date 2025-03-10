<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role as UserRole;

class UserRoleController extends Controller
{
    public function index()
    {
        $roles = UserRole::all();
        $permissions = Permission::all();
        
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    } 
    
    public function store(Request $request)
    {
        $request->validate( [
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
        ]);

        UserRole::create([
            'name' => $request->name,
            'guard_name' => 'admin'
        ]);

        return redirect()->route('admin.roles.index');
    }

    public function update(Request $request, UserRole $role): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        $role->update([
            'name' => $request->name,
        ]);

        return redirect()->back();
    }

    public function destroy(UserRole $role): RedirectResponse
    {
        $role->delete();

        return redirect()->back();
    }
}
