<?php

namespace App\Providers;

use App\Models\Admin;
use App\Models\Order;
use App\Models\PaymentMethod;
use Illuminate\Support\ServiceProvider;
use App\Models\PhoneNumber;
use App\Models\User;
use App\Policies\AdminPolicy;
use App\Policies\OrderPolicy;
use App\Policies\PaymentMethodPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\PhoneNumberPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Role::class => RolePolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::policy(Admin::class, AdminPolicy::class);
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(PaymentMethod::class, PaymentMethodPolicy::class);
        Gate::policy(PhoneNumber::class, PhoneNumberPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Permission::class, PermissionPolicy::class);
    }
}
