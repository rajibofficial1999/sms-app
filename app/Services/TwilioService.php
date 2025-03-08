<?php

namespace App\Services;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class TwilioService
{
    private Client $client;
    private string $twilioNumber;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.account_sid'),
            config('services.twilio.account_token')
        );

        $this->twilioNumber = '+18573672437';
    }

    

    public function sendSMS(string $receiverNumber, string $body): array
    {
        try {
            $this->client->messages->create($receiverNumber, [
                'from' => $this->twilioNumber,
                'body' => $body,
            ]);

            return $this->response(true);

        } catch (Exception $e) {
            Log::error("SMS sending failed: {$e->getMessage()}", ['exception' => $e]);

            return $this->response(false, $e->getMessage());
        }
    }

    public function sendMMS(string $receiverNumber, string $imageUrl): array
    {
        try {
            $absoluteImageUrl = asset($imageUrl);


            $this->client->messages->create($receiverNumber, [
                'from' => $this->twilioNumber,
                "mediaUrl" => [
                    $absoluteImageUrl,
                ],
            ]);

            return $this->response(true);

        } catch (Exception $e) {
            Log::error("MMS sending failed: {$e->getMessage()}", ['exception' => $e]);

            return $this->response(false, $e->getMessage());
        }
    }

    public function receiveMessage(Request $request): array
    {
        $localNumber = $request->input('To');
        $senderNumber = $request->input('From');
        $messageBody = $request->input('Body');
        $mediaUrl = $request->input('MediaUrl');

        return [
            'localNumber' => $localNumber,
            'senderNumber' => $senderNumber,
            'messageBody' => $messageBody,
            'mediaUrl' => $mediaUrl,
        ];
    }

    private function response(bool $success, ?string $error = null): array
    {
        return [
            'success' => $success,
            'error' => $error ?? null, 
        ]; 
    }
}
