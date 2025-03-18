<?php

namespace App\Services;

use App\Interfaces\MessageProvider;
use App\Models\ActiveProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Enums\MessageProvider as ProviderEnum;

class MessageService
{
    protected ?MessageProvider $provider = null;

    public function activeProvider(): MessageProvider
    {
        if (!$this->provider) {
            $activeProvider = ActiveProvider::active()->first();
            
            if (!$activeProvider) {
                $this->provider = app(ProviderEnum::defaultService());
            }else{
                $providerClass = $activeProvider->name->details()['service_class'];
                $this->provider = app($providerClass);
            }            
            
        }

        return $this->provider;
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

            // $response = $this->activeProvider()->sendMMS($receiverNumber, $senderNumber, $imagePath);
        }else{
            // $response = $this->activeProvider()->sendSMS($receiverNumber, $senderNumber, $request->input('body'));
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