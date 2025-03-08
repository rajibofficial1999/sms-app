<?php

namespace App\Models;

use App\Enums\Status;
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
    ];
    
    protected function casts(): array
    {
        return [
            'status' => Status::class,
            'expired_at' => 'datetime',
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

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}