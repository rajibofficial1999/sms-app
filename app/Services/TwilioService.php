<?php

namespace App\Services;

use App\Interfaces\MessageInterface;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class TwilioService implements MessageInterface
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

    

    public function sendSMS(string $receiverNumber, string $body): Collection
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

    public function sendMMS(string $receiverNumber, string $imageUrl): Collection
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

    private function response(bool $success, ?string $error = null): Collection
    {
        return collect([
            'success' => $success,
            'error' => $error ?? null, 
        ])->filter(); 
    }
}
