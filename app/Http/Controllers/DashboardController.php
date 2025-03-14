<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Order;
use App\Models\PhoneNumber;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $userPhoneNumber = $user->phoneNumber()->active()->first();

        $userConversationIds = Conversation::where('local_number_id', $userPhoneNumber?->id)->pluck('id');

        // Messages per hour
        $messagesPerHour = $this->getMessagesPerHour($userPhoneNumber, $userConversationIds);

        // Generate charts for messages sent and received per hour
        $messageCharts = $this->generateMessageChartData($messagesPerHour);

        // Calculate total sent and received messages
        $totalMessages = $messagesPerHour->reduce(function ($carry, $item) {
            $carry['sent'] += $item->sent;
            $carry['received'] += $item->received;
            return $carry;
        }, ['sent' => 0, 'received' => 0]);

        $totalMessagesChart = [
            ['name' => 'sent', 'messages' => (int) $totalMessages['sent']],
            ['name' => 'received', 'messages' => (int) $totalMessages['received']],
        ];

        // Traffic per hour
        $trafficsPerHour = $this->getTrafficsPerHour($userConversationIds);

        // Generate charts for traffic per hour
        $trafficCharts = $this->generateTrafficChartData($trafficsPerHour);

        // Calculate total traffic
        $totalTraffics = Conversation::whereIn('id', $userConversationIds)
            ->whereDate('created_at', Carbon::today())
            ->count();

        $totalTrafficsChart = [
            ['name' => 'traffic', 'traffics' => (int) $totalTraffics]
        ];

        // Latest 5 orders
        $orders = Order::query()
                    ->leftJoin('payment_methods', 'payment_methods.id', '=', 'orders.payment_method_id')
                    ->leftJoin('users', 'users.id', '=', 'orders.user_id')
                    ->leftJoin('phone_numbers', 'phone_numbers.user_id', '=', 'users.id') 
                    ->select(
                        'orders.*', 
                        'payment_methods.type as payment_method_name',
                        'users.name as user_name',
                        'phone_numbers.number as user_renewal_number'
                    ) 
                    ->latest('orders.created_at') 
                    ->paginate(5);

        return Inertia::render('Dashboard/Index', [
            'orders' => $orders,
            'messageCharts' => $messageCharts,
            'totalMessagesChart' => $totalMessagesChart,
            'trafficCharts' => $trafficCharts,
            'totalTrafficsChart' => $totalTrafficsChart,
        ]);
    }

    private function generateMessageChartData($data): Collection
    {
        return collect(range(0, 23))->map(function ($time) use ($data) {
            $formattedTime = Carbon::today()->addHours($time)->format('Y-m-d H:00:00');
            $found = $data->firstWhere('time', $formattedTime);

            return [
                'time' => $found ? Carbon::parse($found->time)->format('h:i A') : Carbon::parse($formattedTime)->format('h:i A'),
                'sent' => $found ? (int) $found->sent : 0,
                'received' => $found ? (int) $found->received : 0,
            ];
        });
    }

    private function generateTrafficChartData($data): Collection
    {
        return collect(range(0, 23))->map(function ($time) use ($data) {
            $formattedTime = Carbon::today()->addHours($time)->format('Y-m-d H:00:00');
            $found = $data->firstWhere('time', $formattedTime);

            return [
                'time' => $found ? Carbon::parse($found->time)->format('h:i A') : Carbon::parse($formattedTime)->format('h:i A'),
                'traffics' => $found ? (int) $found->traffics : 0,
            ];
        });
    }

    private function getMessagesPerHour(?PhoneNumber $userPhoneNumber, mixed $userConversationIds): Collection
    {

         if (!$userPhoneNumber) {
            return collect([]);
        }

        return Message::selectRaw("DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as time, 
                                SUM(CASE WHEN sender_number = ? THEN 1 ELSE 0 END) as sent,
                                SUM(CASE WHEN sender_number != ? THEN 1 ELSE 0 END) as received", 
                                [$userPhoneNumber->number, $userPhoneNumber->number])
                            ->whereDate('created_at', Carbon::today())
                            ->whereIn('conversation_id', $userConversationIds)
                            ->groupBy('time')
                            ->orderBy('time', 'ASC')
                            ->get();
    }

    private function getTrafficsPerHour(mixed $userConversationIds): Collection
    {
        return Conversation::selectRaw("DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as time, 
                                                      count(*) as traffics")
            ->whereDate('created_at', Carbon::today())
            ->whereIn('id', $userConversationIds)
            ->groupBy('time')
            ->orderBy('time', 'ASC')
            ->get();
    }
}
