<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

interface MessageInterface
{
    public function sendMessage(Request $request): Collection;

    public function receiveMessage(Request $request): Collection;
}
