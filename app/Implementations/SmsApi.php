<?php

namespace App\Implementations;

use App\Interfaces\MessageInterface;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class SmsApi implements MessageInterface
{
    private $provider;

    public function __construct()
    {
        $this->provider = new TwilioService();
    }

    public function sendMessage(Request $request): Collection
    {
        // $receiverNumber = $request->traffic_number;
        $receiverNumber = "+18777804236";

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $imagePath = Storage::url($imagePath);

            $response = $this->provider->sendMMS($receiverNumber, $imagePath);
        }else{
            $response = $this->provider->sendSMS($receiverNumber, $request->input('body'));
        }

        $response['imageUrl'] = $imagePath;

        return collect($response);
    }

    public function receiveMessage(Request $request): Collection
    {
        $response = $this->provider->receiveMessage($request);

        return collect($response);
    }
}
