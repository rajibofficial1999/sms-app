<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VerificationCodeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/pricing', [HomeController::class, 'pricing'])->name('pricing');

Route::middleware(['auth', 'verified'])->group(function() {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/billings', [SubscriptionController::class, 'index'])->name('billings');
    Route::get('/checkouts', [SubscriptionController::class, 'checkout'])->name('checkouts.index');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

    Route::prefix('messaging')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('messages.index');
        Route::get('/{conversation}', [MessageController::class, 'getMessages'])->name('messages.show');
    });
});

Route::middleware('auth')->group(function () {
    Route::post('/verify-code', VerificationCodeController::class)->name('verify.code');
});

require __DIR__.'/auth.php';
