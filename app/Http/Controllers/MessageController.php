<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Events\ReceivedMessage;
use App\Http\Requests\MessageStoreRequest;
use App\Interfaces\MessageInterface;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\PhoneNumber;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function __construct(protected MessageInterface $message) {}

    public function index()
    {
        $user = Auth::user();

        $number = $user->phoneNumber;

        $chatLists = $number->conversations()->with('lastMessage')->get();

        return Inertia::render('Messaging', [
            'chatLists' => $chatLists,
        ]);
    }

    public function getMessages(Conversation $conversation)
    {
        $messages = $conversation->messages()->with('image')->latest()->get();

        $user = Auth::user();

        $number = $user->phoneNumber;

        $chatLists = $number->conversations()->with('lastMessage')->get();

        return Inertia::render('Messaging', [
            'chatLists' => $chatLists,
            'conversation' => $conversation,
            'messages' => $messages,
        ]);
    }

    public function store(MessageStoreRequest $request): JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
        }

        if (!$this->isValidSubscription($authUser)) {
            return response()->json(['success' => false, 'message' => 'Don\'t have subscription'], 401);
        }

        $response = $this->message->sendMessage($request); 
        
        if ($response->get('success')) {

            $conversation = Conversation::findOrFail($request->conversation);

            // Handle Image Upload
            $imageUrl = $response->get('imageUrl'); 

            $this->createMessage($conversation, $request->input('body'), $imageUrl);

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
        $response = $this->message->receiveMessage($request);

        $localNumber = $response->get('localNumber');
        $senderNumber = $response->get('senderNumber');
        $messageBody = $response->get('messageBody');
        $mediaUrl = $response->get('mediaUrl');

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


    private function createMessage(Conversation $conversation, ?string $messageBody, ?string $imageUrl = null, bool $isIncoming = false): Message
    {
        $message = $conversation->messages()->create([
            'body'          => $messageBody,
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

    public function isValidSubscription(User $authUser): bool
    {
        if(!$authUser->subscription || $authUser->subscription->is_expired || $authUser->subscription->status !== Status::COMPLETED) {
            return false;
        }

        return true;    
    }
}
