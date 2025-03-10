<?php

namespace App\Models;

use App\Enums\Status;
use App\Enums\SubscriptionPeriod;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'order_id',
        'expired_at',
        'status',
        'period',
        'payment_method_id',
    ];
    
    protected function casts(): array
    {
        return [
            'status' => Status::class,
            'expired_at' => 'datetime',
            'period' => SubscriptionPeriod::class,
        ];
    }

    protected $appends = ['is_expired'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function isExpired(): Attribute
    {
        return Attribute::make(
            get: fn () => !$this->expired_at->isFuture(),
        );
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}