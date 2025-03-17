<?php

namespace App\Providers;

use App\Models\AppSetting;
use Illuminate\Support\ServiceProvider;
use App\Models\ServicePrice;
use App\Policies\AppSettingPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\RolePolicy;
use App\Policies\ServicePricePolicy;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Role::class => RolePolicy::class,
        Permission::class => PermissionPolicy::class,
        AppSetting::class => AppSettingPolicy::class,
        ServicePrice::class => ServicePricePolicy::class,
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
        Gate::policy(ServicePrice::class, ServicePricePolicy::class);
        Gate::policy(AppSetting::class, AppSettingPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Permission::class, PermissionPolicy::class);
    }
}
