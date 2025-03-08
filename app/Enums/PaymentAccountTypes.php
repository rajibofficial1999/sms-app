<?php

namespace App\Enums;

enum PaymentAccountTypes : string
{
    case PERSONAL = 'personal';
    case BUSINESS = 'business';
    case AGENT = 'agent';
    case REGULAR = 'regular';
    case SAVING = 'saving';
}
