<?php

namespace App\Enums;

use App\Services\Message\TwilioService;
use App\Services\Message\VonageService;

enum MessageProvider: string
{
    case TWILIO = 'twilio';
    case VONAGE = 'vonage';

    public function details(): array
    {
        return match ($this) {
            self::TWILIO => [
                'service_class' => TwilioService::class,
            ],

            self::VONAGE => [
                'service_class' => VonageService::class,
            ]
        };
    }

    public static function defaultService(): string
    {
        return self::TWILIO->details()['service_class'];
    }

    public static function allDetails(): array
    {
        return array_map(fn ($case) => ['value' => $case->value] + $case->details(), self::cases());
    }
}

