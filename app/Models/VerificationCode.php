<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class VerificationCode extends Model
{
    protected $fillable = ['code', 'is_used', 'codeable_type', 'codeable_id'];

    public function codeable(): MorphTo
    {
        return $this->morphTo();
    }
}
