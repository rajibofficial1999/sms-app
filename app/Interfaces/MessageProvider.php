<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface MessageProvider
{
    public function sendSMS(string $receiverNumber, string $senderNumber, string $body): array;

    public function sendMMS(string $receiverNumber, string $senderNumber, string $imageUrl): array;
    
    public function receiveMessage(Request $request): array;
}