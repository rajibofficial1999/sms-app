<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class MessageServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Services\Message\TwilioService::class, function ($app) {
            return new \App\Services\Message\TwilioService();
        });

        $this->app->bind(\App\Services\Message\VonageService::class, function ($app) {
            return new \App\Services\Message\VonageService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
