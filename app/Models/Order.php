<?php

namespace App\Models;

use App\Enums\Status;
use App\Enums\SubscriptionPeriod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'payment_method_id',
        'account_holder_name',
        'payment_screenshot',
        'period',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => Status::class,
            'period' => SubscriptionPeriod::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(subscription::class);
    }
}
