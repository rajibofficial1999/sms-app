<?php

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\UserPermissionController;
use App\Http\Controllers\Admin\UserRoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->name('dashboard');

Route::resource('/orders', OrderController::class)->only(['index', 'update', 'destroy']);

Route::resource('/roles', UserRoleController::class)->except(['edit', 'show', 'create']);

Route::resource('/permissions', UserPermissionController::class)->only(['store', 'update', 'destroy']);
Route::post('/permissions/remove', [UserPermissionController::class, 'removePermission'])->name('permissions.remove');
Route::post('/manage-roles/assign-permission', [UserPermissionController::class, 'assignPermission'])->name('roles.assign_permission');