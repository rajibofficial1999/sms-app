<?php

namespace App\Services\Message;

use App\Interfaces\MessageProvider;
use Exception;
use Illuminate\Http\Request;

class VonageService implements MessageProvider
{

    public function __construct()
    {
        
    }

    public function sendSMS(string $receiverNumber, string $senderNumber, string $body): array
    {
        return $this->response(true);
    }

    public function sendMMS(string $receiverNumber, string $senderNumber, string $imageUrl): array
    {
        return $this->response(true);
    }

    public function receiveMessage(Request $request): array
    {
        return $this->response(true);
    }

    private function response(bool $success, ?string $error = null): array
    {
        return [
            'success' => $success,
            'error' => $error ?? null, 
        ]; 
    }
}
