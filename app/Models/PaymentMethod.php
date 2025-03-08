<?php

namespace App\Models;

use App\Enums\PaymentAccountTypes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'account_number',
        'account_type',
        'logo',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'account_type' => PaymentAccountTypes::class,
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', true);
    }
}
