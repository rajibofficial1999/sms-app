<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Status;
use App\Helpers\Redirect;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response | RedirectResponse
    {
        if ($this->cannot('viewAny')) {
            return Redirect::unauthorized();
        }

        $users = User::with('subscription', 'phoneNumber')->latest()->paginate(10);
        
        return Inertia::render('Admin/User/Index',[
            'users' => $users,
            'statuses' => Status::cases(),
        ]);
    }

    public function toggleStatus(User $user): RedirectResponse
    {  
        if ($this->cannot('status', $user)) {
            return Redirect::unauthorized();
        }

       $user->update([
            'status' => !$user->status,
        ]);

       return redirect()->back();
    }

    public function search(?string $search = null): JsonResponse
    {
        $users = User::with('subscription', 'phoneNumber')->when($search, function($query) use ($search) {
            $query->where('name', 'like', "%$search%");
        })->latest()->paginate(10);

        return response()->json([
            'users' => $users,
        ]);
    }

    public function filter(?string $status = null): JsonResponse
    {
        $users = User::with('subscription', 'phoneNumber')->when($status, function($userQuery) use ($status) {

            if($status === 'subscribed') {
                $userQuery->whereHas('subscription');
                return;
            }

            if($status === 'unsubscribed') {
                $userQuery->whereDoesntHave('subscription');    
                return;
            }
            
            $userQuery->whereHas('subscription', function($subscriptionQuery) use ($status) {
                $subscriptionQuery->whereStatus($status); 
            });
        })->latest()->paginate(10);

        return response()->json([
            'users' => $users,
        ]);
    }

    
    public function destroy(User $user): RedirectResponse
    {
        if ($this->cannot('delete', $user)) {
            return Redirect::unauthorized();
        }

       $user->delete();

       return redirect()->back();
    }

    private function cannot(string $operation, ?User $user = null): bool
    {
        if (!$user) {
            return Gate::forUser(Auth::guard('admin')->user())->denies($operation, User::class);
        }

        return Gate::forUser(Auth::guard('admin')->user())->denies($operation, $user);
    }
}
