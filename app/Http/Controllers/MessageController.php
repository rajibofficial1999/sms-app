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
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function __construct(protected MessageInterface $message) {}

    public function index(): Response
    {
        $user = Auth::user();

        $number = $user->phoneNumber;

        $chatLists = $this->getChatLists($number);

        return Inertia::render('Messaging', [
            'chatLists' => $chatLists,
        ]);
    }

    public function getMessages(Conversation $conversation): Response
    {
        $user = Auth::user();
        $userNumber = $user->phoneNumber;

        $messagesQuery = Message::where('conversation_id', $conversation->id);

        $messages = $messagesQuery->with('image')->latest()->paginate(50);
        
        $messagesQuery->where('sender_number', '!=', $userNumber->number)
            ->where('isUnread', true)
            ->update(['isUnread' => false]);

        return Inertia::render('Messaging', [
            'chatLists' => $this->getChatLists($userNumber),
            'conversation' => $conversation,
            'messages' => $messages ,
        ]);
    }

    public function store(MessageStoreRequest $request): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User) {
            return $this->forbiddenResponse('User not authenticated');
        }

        if (!$this->isValidSubscription($authUser)) {
            return $this->forbiddenResponse('Don\'t have subscription');
        }

        $conversation = Conversation::find($request->conversation);
        if ($this->isBlockedConversation($authUser, $conversation, $request->receiver_number)) {
            return $this->forbiddenResponse('The number has blocked');
        }

        $response = $this->message->sendMessage($request); 
        if (!$response->get('success')) {
            return response()->json([
                'success' => false,
                'message' => "Message couldn't be sent",
                'error' => $response->get('error'),
            ], 500);
        }

        if (!$conversation) {
            $conversation = $this->createConversation($authUser->phoneNumber, $request->receiver_number);
        }

        // get Image Url
        $imageUrl = $response->get('imageUrl'); 

        return response()->json([
            'success' => true,
            'message' => $this->createMessage($conversation, $request->input('body'), $imageUrl),
        ], 201);
    }

    public function receivedMessage(Request $request): void
    {
        $response = $this->message->receiveMessage($request);

        $localNumber = $response->get('localNumber');
        $senderNumber = $response->get('senderNumber');
        $messageBody = $response->get('messageBody');
        $mediaUrl = $response->get('mediaUrl');

        $phoneNumber = PhoneNumber::where('number', $localNumber)->first();
        if (!$phoneNumber) {
            return;
        }

        $conversation = Conversation::where('traffic_number', $senderNumber)
            ->where('local_number_id', $phoneNumber->id)
            ->first();

        if ($this->isBlockedConversation($phoneNumber->user, $conversation, $senderNumber)) {
            return;
        }

        if (!$conversation) {
            $conversation = $this->createConversation($phoneNumber,  $senderNumber);
        }

        $message = $this->createMessage($conversation, $messageBody, $mediaUrl, true);
        broadcast(new ReceivedMessage($message));
    }

    public function getMessagesByNumber(string $trafficNumber)
    {
        $conversation = Conversation::where('traffic_number', $trafficNumber)->first();
        if(!$conversation) {
            return response()->json([
                'success' => false,
                'messages' => null,
                'conversation'    => null
            ]);
        }

        return response()->json([
             'success' => true,
            'messages' => $conversation->messages()->with('image')->latest()->paginate(50),
            'conversation'    => $conversation
        ]);
    }


    private function createMessage(
        Conversation $conversation, 
        ?string $messageBody, 
        ?string $imageUrl = null, 
        bool $isIncoming = false
    ): Message
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

    private function isValidSubscription(User $authUser): bool
    {
        $subscription = $authUser->subscription;

        if(!$subscription || $subscription->is_expired || $subscription->status !== Status::COMPLETED) {
            return false;
        }

        return true;    
    }

    private function createConversation(PhoneNumber $userNumber, string $traffic_number): Conversation
    {
        return Conversation::create([
                'traffic_number' => $traffic_number,
                'local_number_id' => $userNumber->id
        ]);
    }

    private function getChatLists(?PhoneNumber $userPhoneNumber): Collection
    {
        if (!$userPhoneNumber) {
            return collect();
        }

        return $userPhoneNumber->conversations()
                        ->leftJoin('messages', function ($join) use($userPhoneNumber) {
                            $join->on('messages.conversation_id', '=', 'conversations.id')
                                ->where('messages.isUnread', true)
                                ->where('messages.sender_number', '!=', optional($userPhoneNumber)->number);
                        })
                        ->leftJoin('messages as last_messages', function ($join) {
                            $join->on('last_messages.id', '=', 'conversations.last_message_id');
                        })   
                        ->groupBy(
                            'conversations.id',
                            'conversations.local_number_id',
                            'conversations.traffic_number',
                            'conversations.last_message_id',
                            'conversations.avatar_color',
                            'conversations.created_at',
                            'conversations.updated_at',
                            'last_messages.id',
                            'last_messages.body',
                            'last_messages.created_at'
                        )
                        ->selectRaw('
                            conversations.*, 
                            COUNT(messages.id) AS unread_messages_count,
                            last_messages.body AS last_message_body,
                            last_messages.created_at AS last_message_time
                        ')
                        ->latest()
                        ->get();
                        
    }

    private function forbiddenResponse(string $message): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message], 403);
    }

    private function isBlockedConversation(User $authUser, ?Conversation $conversation, string $checkingNumber): bool
    {
        if ($conversation && $conversation->isBlocked) {
            return true;
        }

        return $authUser->blockLists()->where('blocked_number', $checkingNumber)->exists();
    }
}
