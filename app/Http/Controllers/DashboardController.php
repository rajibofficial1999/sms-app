<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Order;
use App\Models\PhoneNumber;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
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

        $messagesPerHour = $this->getMessagesPerHour($userPhoneNumber, $userConversationIds);

        $messageCharts = $this->generateMessageChartData($messagesPerHour);

        $trafficCharts = $this->generateTrafficChartData($userConversationIds);

        $totalMessagesChart = $this->totalMessagesChart($messagesPerHour);

        $totalTrafficsChart = $this->totalTrafficsChart($userConversationIds);

        $orders = $this->getOrders();   

        return Inertia::render('Dashboard/Index', [
            'orders' => $orders,
            'messageCharts' => $messageCharts,
            'totalMessagesChart' => $totalMessagesChart,
            'trafficCharts' => $trafficCharts,
            'totalTrafficsChart' => $totalTrafficsChart,
        ]);
    }

    private function generateMessageChartData(Collection $data): Collection
    {
        return collect(range(0, 23))->map(function ($hour) use ($data) {
            $formattedTime = Carbon::now()->subHours(23 - $hour)->format('Y-m-d H:00:00');

            $found = $data->firstWhere('time', $formattedTime);

            return [
                'time' => Carbon::parse($formattedTime)->format('h:i A'),
                'sent' => $found ? (int) $found->sent : 0,
                'received' => $found ? (int) $found->received : 0,
            ];
        });
    }

    private function generateTrafficChartData(mixed $userConversationIds): Collection
    {
        $data = Conversation::selectRaw("
                DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as time, 
                count(*) as traffics"
            )
            ->where('created_at', '>=', Carbon::now()->subHours(24)) 
            ->whereIn('id', $userConversationIds)
            ->groupBy('time')
            ->orderBy('time', 'ASC')
            ->get();

        return collect(range(0, 23))->map(function ($hour) use ($data) {
            $formattedTime = Carbon::now()->subHours(23 - $hour)->format('Y-m-d H:00:00'); 

            $found = $data->firstWhere('time', $formattedTime);

            return [
                'time' => Carbon::parse($formattedTime)->format('h:i A'),
                'traffics' => $found ? (int) $found->traffics : 0,
            ];
        });
    }

    private function totalMessagesChart(Collection $messagesPerHour): Collection
    {
        $totalMessages = $messagesPerHour->reduce(function ($carry, $item) {
            $carry['sent'] += $item->sent;
            $carry['received'] += $item->received;
            return $carry;
        }, ['sent' => 0, 'received' => 0]);

        return collect([
            ['name' => 'sent', 'messages' => (int) $totalMessages['sent']],
            ['name' => 'received', 'messages' => (int) $totalMessages['received']],
        ]); 

    }

    private function totalTrafficsChart(mixed $userConversationIds): Collection
    {
        $totalTraffics = Conversation::whereIn('id', $userConversationIds)
            ->whereDate('created_at', Carbon::today())
            ->count();

        return collect([
            ['name' => 'traffic', 'traffics' => (int) $totalTraffics]
        ]); 
    }

    private function getMessagesPerHour(?PhoneNumber $userPhoneNumber, mixed $userConversationIds): Collection
    {
        if (!$userPhoneNumber) {
            return collect([]);    
        } 

        return Message::selectRaw("DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as time, 
                    SUM(CASE WHEN sender_number = ? THEN 1 ELSE 0 END) as sent,
                    SUM(CASE WHEN sender_number != ? THEN 1 ELSE 0 END) as received"
                )
                ->addBinding([$userPhoneNumber->number, $userPhoneNumber->number], 'select')
                ->where('created_at', '>=', Carbon::now()->subHours(24))
                ->whereIn('conversation_id', $userConversationIds)
                ->groupBy('time')
                ->orderBy('time', 'ASC')
                ->get();
        
    }

    private function getOrders(): LengthAwarePaginator
    {
        return Order::query()
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
    }
}
