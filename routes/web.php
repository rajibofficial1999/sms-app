<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PhoneNumberController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VerificationCodeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/pricing', [HomeController::class, 'pricing'])->name('pricing');

Route::middleware(['auth', 'verified'])->group(function() {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/billings', [SubscriptionController::class, 'index'])->name('billings');
    Route::get('/checkouts', [SubscriptionController::class, 'checkout'])->name('checkouts.index');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');

    Route::delete('/conversations/{conversation}', [ConversationController::class, 'destroy'])->name('conversations.destroy');
    Route::post('/conversations/{conversation}/block', [ConversationController::class, 'block'])->name('conversations.block');
    Route::post('/conversations/{conversation}/unblock', [ConversationController::class, 'unBlock'])->name('conversations.unblock');
    Route::post('/conversations/{conversation}/block-destroy', [ConversationController::class, 'blockAndDestroy'])->name('conversations.block_destroy');

    Route::post('/phone-numbers/{blockList}/unblock', [PhoneNumberController::class, 'unBlock'])->name('phone-numbers.unblock');

    Route::prefix('messaging')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('messages.index');
        Route::get('/{conversation}', [MessageController::class, 'getMessages'])->name('messages.show');
        Route::delete('/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::post('/verify-code', VerificationCodeController::class)->name('verify.code');
});

Route::post('/subscribe', [SubscriberController::class, 'subscribe'])->name('subscribe');
Route::get('/unsubscribe/{email}', [SubscriberController::class, 'unsubscribe'])->name('unsubscribe');

Route::get('/create/random-messsage-for-testing', function() {
    // $user = auth()->user();
    // $userPhoneNumber = $user->phoneNumber;
    // $conversation = $userPhoneNumber->conversations()->latest()->first();

    // $data = [];

    // foreach (range(1, 100) as $i) {
    //     $data[$i] = [
    //         'body' => fake()->sentence(),
    //         'sender_number' => fake()->randomElement([$conversation->traffic_number, $userPhoneNumber->number]),
    //         'isUnread' => true,
    //     ];
    // }

    // $conversation->messages()->createMany($data);

})->name('crate.random_message');

require __DIR__.'/auth.php';