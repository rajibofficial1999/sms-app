<?php

namespace App\Models;

use App\Enums\Status;
use App\Enums\SubscriptionPeriod;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'payment_method_id',
        'account_holder_name',
        'payment_screenshot',
        'area_code',
        'period',
        'status',
    ];

    protected $appends = ['is_renewal'];

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

    public function isRenewal(): Attribute
    {
        return Attribute::make(
            get: fn () => optional($this->user?->phoneNumber)->exists(),
        );
    }
}
