<?php

namespace App\Enums;

enum SubscriptionPeriod: string
{
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';

    public function details(): array
    {
        return match ($this) {
            self::WEEKLY => [
                'price' => 3000
            ],
            self::MONTHLY => [
                'price' => 10000
            ]
        };
    }

    public static function allDetails(): array
    {
        return array_map(fn ($case) => ['value' => $case->value] + $case->details(), self::cases());
    }
}

