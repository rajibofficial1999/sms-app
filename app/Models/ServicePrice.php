<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePrice extends Model
{
    protected $fillable = [
        'incoming_sms_price',
        'outgoing_sms_price',
        'incoming_mms_price',
        'outgoing_mms_price',
        'incoming_call_price',
        'outgoing_call_price',
    ];
}
