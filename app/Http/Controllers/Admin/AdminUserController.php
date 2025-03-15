<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Redirect;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreRequest;
use App\Http\Requests\Admin\AdminUpdateRequest;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    public function index(): Response | RedirectResponse
    {
        if ($this->cannot('viewAny')) {
            return Redirect::unauthorized();
        }
        
        $admins = Admin::with('roles')
                    ->whereNot('id', Auth::guard('admin')->user()->id)
                    ->paginate(10);

        return Inertia::render('Admin/Admin/Index', [
            'admins' => $admins,
            'role_names' => Role::pluck('name')
        ]);
    }

    public function create(): Response | RedirectResponse
    {
        if ($this->cannot('create')) {
            return Redirect::unauthorized();
        }

        return Inertia::render('Admin/Admin/Create', [
            'roles' => Role::all(),
            'email' => request()->get('email'),
        ]);
    }

    public function store(AdminStoreRequest $request): RedirectResponse
    {
        if ($this->cannot('create')) {
            return Redirect::unauthorized();
        }

        $validated = $request->validated();
        $roles = $request->roles;

        unset($validated['roles']);

        $admin = Admin::create($validated);

        $admin->assignRole($roles);

        $admin->sendEmailVerificationNotification();

        return redirect()->route('admin.admin-users.create', [
            'email' => $admin->email,
        ]);
    }

    public function show(Admin $admin_user)
    {
        //
    }

    public function edit(Admin $admin_user): Response | RedirectResponse
    {
        if ($this->cannot('update', $admin_user)) {
            return Redirect::unauthorized();
        }

        return Inertia::render('Admin/Admin/Edit', [
            'roles' => Role::all(),
            'admin' => $admin_user->load('roles'),
            'email' => request()->get('email'),
        ]);
    }
  
    public function update(AdminUpdateRequest $request, Admin $admin_user): RedirectResponse
    {
        if ($this->cannot('update', $admin_user)) {
            return Redirect::unauthorized();
        }

        $validated = $request->validated();
        $roles = $request->roles;

        unset($validated['roles']);

        if(! $request->password){
            unset($validated['password']);
        }

        $admin_user->fill($validated);

        if ($admin_user->isDirty('email')) {
            $admin_user->email_verified_at = null;
            $admin_user->sendEmailVerificationNotification();
        }

        $admin_user->save();

        $admin_user->assignRole($roles);

        if($admin_user->wasChanged('email')){            
               return redirect()->route('admin.admin-users.create', [
                'email' => $admin_user->email,
            ]);
        }   

        return redirect()->route('admin.admin-users.index');
    }
    
    public function destroy(Admin $admin_user): RedirectResponse
    {
        if ($this->cannot('delete', $admin_user)) {
            return Redirect::unauthorized();
        }

        if (Storage::disk('public')->exists($admin_user->avatar || "")) {
            Storage::disk('public')->delete($admin_user->avatar || "");
        }

        $admin_user->delete();

        return redirect()->back();
    }

    public function toggleStatus(Admin $admin): RedirectResponse
    {
        if ($this->cannot('status', $admin)) {  
            return Redirect::unauthorized();
        }    
          
       $admin->update([
            'status' => !$admin->status,
        ]);

       return redirect()->back();
    }

    public function search(?string $search = null): JsonResponse
    {
        $adminUsers = Admin::with('roles')->when($search, function($query) use ($search) {
            $query->where('name', 'like', "%$search%");
        })->latest()->paginate(10);

        return response()->json([
            'adminUsers' => $adminUsers,
        ]);
    }

    public function filter(?string $role_name = null): JsonResponse
    {
        $adminUsers = Admin::with('roles')->when($role_name, function($query) use ($role_name) {   
            $query->whereHas('roles', function($q) use ($role_name) {
                $q->whereName($role_name); 
            });
        })->latest()->paginate(10);

        return response()->json([
            'adminUsers' => $adminUsers,
        ]);
    }

    private function cannot(string $operation, ?Admin $admin_user = null): bool
    {
        if (!$admin_user) {
            return Gate::forUser(Auth::guard('admin')->user())->denies($operation, Admin::class);
        }

        return Gate::forUser(Auth::guard('admin')->user())->denies($operation, $admin_user);
    }
}
