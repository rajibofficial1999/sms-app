<?php

namespace App\Traits;

use App\Models\VerificationCode;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait VerificationCodes
{
    public function createEmailVerificationCode(): int
    {
        $code = random_int(100000, 999999);
        $token = bin2hex(random_bytes(15));

        $this->verification_code()->updateOrCreate(
            [
                'codeable_id' => $this->id, 
                'codeable_type' => static::class
            ],
            [
                'code' => $code,
                'token' => $token,
            ]
        );

        return $code;
    }

    public function verification_code(): MorphOne
    {
        return $this->morphOne(VerificationCode::class, 'codeable');
    }
}
