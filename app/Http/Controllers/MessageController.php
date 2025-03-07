<?php

namespace App\Http\Controllers;

use App\Events\ReceivedMessage;
use App\Http\Requests\MessageStoreRequest;
use App\Interfaces\MessageInterface;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\PhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function __construct(protected MessageInterface $message) {}

    public function index()
    {
        $number = PhoneNumber::whereNumber('+18573672437')->first();

        $chatLists = $number->conversations()->with('lastMessage')->get();

        return Inertia::render('Messaging', [
            'chatLists' => $chatLists,
        ]);
    }

    public function getMessages(Conversation $conversation)
    {
        $messages = $conversation->messages()->with('image')->latest()->get();

        $number = PhoneNumber::whereNumber('+18573672437')->first();

        $chatLists = $number->conversations()->with('lastMessage')->get();

        return Inertia::render('Messaging', [
            'chatLists' => $chatLists,
            'conversation' => $conversation,
            'messages' => $messages,
        ]);
    }

    public function store(MessageStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $authUser = Auth::user();

        if (!$authUser) {
            return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
        }

        if (!$authUser->subscription || $authUser->subscription->is_expired) {
            return response()->json(['success' => false, 'message' => 'Don\'t have subscription'], 401);
        }

        $conversation = Conversation::findOrFail($validated['conversation']);
        // $receiverNumber = $conversation->traffic_number;
        $receiverNumber = "+18777804236";

        // Handle Image Upload
        $imageUrl = $this->uploadImage($request);

        // Send SMS or MMS based on available data
        $response = $validated['body']
            ? $this->message->sendSMS($receiverNumber, $validated['body'])
            : $this->message->sendMMS($receiverNumber, $imageUrl);

        if ($response->get('success')) {
            $this->createMessage($conversation, $validated['body'] ?? null, $imageUrl);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => "Message couldn't be sent",
            'error'   => $response->get('error'),
        ], 500);
    }

    public function receivedMessage(Request $request): void
    {
        // Extract relevant Twilio data
        $localNumber = $request->input('To');
        $senderNumber = $request->input('From');
        $messageBody = $request->input('Body');
        $mediaUrl = $request->input('MediaUrl0');

        $conversation = Conversation::where('traffic_number', $senderNumber)->whereHas('localNumber', function($query) use ($localNumber) {
            $query->where('number', $localNumber);
        })->first();

        if(!$conversation) {
            $localNumber = PhoneNumber::where('number', $localNumber)->first();

            $conversation = $localNumber->conversations()->create([
                'traffic_number' => $senderNumber,
            ]);
        }

        $message = $this->createMessage($conversation, $messageBody, $mediaUrl, true);

        broadcast(new ReceivedMessage($message));
    }

    private function uploadImage(Request $request): ?string
    {
        if (!$request->hasFile('image')) {
            return null;
        }

        $imagePath = $request->file('image')->store('images', 'public');
        return Storage::url($imagePath);
    }

    private function createMessage(Conversation $conversation, ?string $body = null, ?string $imageUrl = null, bool $isIncoming = false): Message
    {
        $message = $conversation->messages()->create([
            'body'          => $body,
            'sender_number' => $isIncoming ? $conversation->traffic_number : $conversation->localNumber->number,
        ]);

        if ($imageUrl) {
            $message->image()->create([
                'image_url' => $imageUrl,
            ]);
        }

        $conversation->update([
            'last_message_id' => $message->id,
        ]);

        return $message->load('image');
    }
}
