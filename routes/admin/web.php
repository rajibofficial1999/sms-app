<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\PhoneNumberController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserPermissionController;
use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\Admin\VerificationCodeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['admin.auth', 'admin.verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::resource('/admin-users', AdminUserController::class);
    Route::put('/admin-users/status/{admin}', [AdminUserController::class, 'toggleStatus'])->name('admin-users.status');

    Route::resource('/users', UserController::class)->except(['show', 'update', 'edit']);
    Route::put('/users/status/{user}', [UserController::class, 'toggleStatus'])->name('users.status');

    Route::resource('/phone-numbers', PhoneNumberController::class)->except(['show', 'create', 'store', 'edit']);
    Route::put('/phone-numbers/status/{phoneNumber}', [PhoneNumberController::class, 'toggleStatus'])->name('phone-numbers.status');

    Route::resource('/orders', OrderController::class)->only(['index', 'update', 'destroy']);
    Route::put('/orders/{order}/approve', [OrderController::class, 'approveNewOrder'])->name('orders.approve');

    Route::resource('/payment-methods', PaymentMethodController::class)->except(['show']);
    Route::put('/payment-methods/status/{paymentMethod}', [PaymentMethodController::class, 'toggleStatus'])->name('payment-methods.status');

    Route::resource('/roles', UserRoleController::class)->except(['edit', 'show', 'create']);

    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::resource('/permissions', UserPermissionController::class)->only(['store', 'update', 'destroy']);
    Route::post('/permissions/remove', [UserPermissionController::class, 'removePermission'])->name('permissions.remove');
    Route::post('/manage-roles/assign-permission', [UserPermissionController::class, 'assignPermission'])->name('roles.assign_permission');       
});


Route::middleware('admin.auth')->group(function () {
    Route::post('/verify-code', VerificationCodeController::class)->name('verify.code');
});

require base_path('routes/admin/auth.php');

