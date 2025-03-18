<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\PhoneNumberController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserPermissionController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['web']], function () {
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/messages/webhook', [MessageController::class, 'receivedMessage']);

    Route::get('/messages/{trafficNumber}', [MessageController::class, 'getMessagesByNumber'])->name('messages.index.by_number');
    Route::post('/messages/load-more', [MessageController::class, 'loadMoreMessages'])->name('messages.load_more');

    Route::get('/orders/search/{search?}', [OrderController::class, 'search'])->name('admin.orders.search');
    Route::get('/orders/filter/{status?}', [OrderController::class, 'filter'])->name('admin.orders.filter');

    Route::get('/manage-roles/{role}', [UserPermissionController::class, 'getPermissions'])->name('admin.roles.permissions');

    Route::get('/payment-methods/search/{search?}', [PaymentMethodController::class, 'search'])->name('admin.payment-methods.search');

    Route::get('/phone-numbers/search/{search?}', [PhoneNumberController::class, 'search'])->name('admin.phone-numbers.search');

    Route::get('/users/search/{search?}', [UserController::class, 'search'])->name('admin.users.search');
    Route::get('/users/filter/{status?}', [UserController::class, 'filter'])->name('admin.users.filter');

    Route::get('/admin-users/search/{search?}', [AdminUserController::class, 'search'])->name('admin.admin-users.search');
    Route::get('/admin-users/filter/{role_name?}', [AdminUserController::class, 'filter'])->name('admin.admin-users.filter');
});