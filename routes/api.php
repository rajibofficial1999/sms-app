<?php

use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['web']], function () {
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/messages/webhook', [MessageController::class, 'receivedMessage']);
});