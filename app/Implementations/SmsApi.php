<?php

namespace App\Implementations;

use App\Interfaces\MessageInterface;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
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
        $userPhoneNumber = Auth::user()->phoneNumber;

        if(! $userPhoneNumber || !$userPhoneNumber->status) {
            return collect([
                'success' => false,
                'error' => 'User phone number not found',
            ]);
        }

        $receiverNumber = $request->receiver_number;
        $senderNumber = $userPhoneNumber->number;
        // $receiverNumber = "+18777804236"; //Testing purpose
        $response['success'] = true; //Testing purpose

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $imagePath = asset(Storage::url($imagePath));

            // $response = $this->provider->sendMMS($receiverNumber, $senderNumber, $imagePath);
        }else{
            // $response = $this->provider->sendSMS($receiverNumber, $senderNumber, $request->input('body'));
        }

        $response['imageUrl'] = $imagePath;
        $response['user_number_id'] = $userPhoneNumber->id;

        return collect($response);
    }

    public function receiveMessage(Request $request): Collection
    {
        $response = $this->provider->receiveMessage($request);

        return collect($response);
    }
}
