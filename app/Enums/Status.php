<?php

namespace App\Enums;

enum Status: string
{
    case PENDING = 'pending';
    case COMPLETED = 'completed';
    case REJECTED = 'rejected';
}

