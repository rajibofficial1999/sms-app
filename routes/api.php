<?php

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\UserPermissionController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['web']], function () {
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/messages/webhook', [MessageController::class, 'receivedMessage']);
    Route::post('/orders/search', [OrderController::class, 'search'])->name('admin.orders.search');
    Route::post('/orders/filter', [OrderController::class, 'filter'])->name('admin.orders.filter');

    Route::get('/manage-roles/{role}', [UserPermissionController::class, 'getPermissions'])->name('admin.roles.permissions');

    Route::post('/payment-methods/search', [PaymentMethodController::class, 'search'])->name('admin.payment-methods.search');
});