<?php

namespace App\Traits;

use App\Models\VerificationCode;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasVerificationCodes
{
    public function createEmailVerificationCode(): int
    {
        $code = random_int(100000, 999999);

        VerificationCode::updateOrCreate(
            [
                'codeable_id' => $this->id, 
                'codeable_type' => static::class,
            ],
            [
                'code' => $code,
                'is_used' => false,
            ]
        );


        return $code;
    }

    public function verification_code(): MorphOne
    {
        return $this->morphOne(VerificationCode::class, 'codeable');
    }
}
