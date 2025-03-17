<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Order;
use App\Models\PhoneNumber;
use App\Models\ServicePrice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Illuminate\Support\Collection;
use Illuminate\Support\Number;


class DashboardController extends Controller
{
    private Carbon $startDate;
    private Carbon $endDate;
    private string $currentMonth;

    public function __construct()
    {
        $this->startDate = Carbon::now()->subMonths(11)->startOfMonth();
        $this->endDate = Carbon::now()->endOfMonth();
        $this->currentMonth = Carbon::now()->format('Y-m');
    }

    public function index()
    {
        $orderStatuses = collect(Status::cases())->map(fn($status) => $status->value);

        $ordersPerMonth = $this->ordersPerMonth();
        $orderCharts = $this->getOrderCharts($ordersPerMonth, $orderStatuses);
        
        $userCharts = $this->getUserCharts(User::class, 'created_at');
        $categoriesUserCharts = $this->categoriesUserCharts();
        $categoriesOrderCharts = $this->categoriesOrderCharts($orderStatuses, $ordersPerMonth);
        
        $smsPerMonth = $this->getMessagePerMonthBaseQuery()->whereDoesntHave('image')->first();
        $mmsPerMonth = $this->getMessagePerMonthBaseQuery()->whereHas('image')->first();

        $categoriesSMS = $this->getCategoriesSMS($smsPerMonth);
        $categoriesMMS = $this->getCategoriesMMS($mmsPerMonth);

        $getProfitData = $this->getProfitData($smsPerMonth, $mmsPerMonth);

        return Inertia::render('Admin/Dashboard/Index', [
            'userCharts' => $this->formatCharts($userCharts),
            'orderCharts' => $orderCharts,
            'categoriesUserCharts' => $categoriesUserCharts,
            'categoriesOrderCharts' => $categoriesOrderCharts,
            'categoriesSMS' => $categoriesSMS,
            'categoriesMMS' => $categoriesMMS,
            'profit' => $getProfitData->get('profit'),
            'consumed' => $getProfitData->get('consumed'),
            'sales' => $getProfitData->get('sales'),
        ]);
    }

    private function getUserCharts(string $model, string $dateField): Collection
    {
        $dataPerMonth = $model::selectRaw("DATE_FORMAT($dateField, '%Y-%m') as month, COUNT(*) as count")
            ->whereBetween($dateField, [$this->startDate, $this->endDate])
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->pluck('count', 'month');

        return $this->formatMonthlyData($dataPerMonth);
    }

    private function getOrderCharts(Collection $ordersPerMonth, Collection $orderStatuses): Collection
    {
        $data = $this->formatOrderChartsData($ordersPerMonth, $orderStatuses);
        return collect([
            'data' => $data,
            'startDate' => $this->startDate->format('M Y'),
            'endDate' => $this->endDate->format('M Y'),
        ]);
    }

    private function ordersPerMonth(): Collection
    {
        return Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, status, COUNT(*) as count')
            ->whereBetween('created_at', [$this->startDate, $this->endDate])
            ->groupBy('month', 'status')
            ->orderBy('month', 'asc')
            ->get()
            ->groupBy('month');
    }

    private function getMessagePerMonthBaseQuery(): Builder
    {
        $phoneNumbers = PhoneNumber::active()->pluck('number')->toArray();
        if (empty($phoneNumbers)) {
            return Message::selectRaw("DATE_FORMAT(created_at, '%b %Y') as month, 0 as sent, 0 as received")
                ->whereRaw('1 = 0');
        }

        $placeholders = implode(',', array_fill(0, count($phoneNumbers), '?'));
        return Message::selectRaw("DATE_FORMAT(created_at, '%b %Y') as month, 
                    CAST(SUM(CASE WHEN sender_number IN ($placeholders) THEN 1 ELSE 0 END) AS UNSIGNED) as sent, 
                    CAST(SUM(CASE WHEN sender_number NOT IN ($placeholders) THEN 1 ELSE 0 END) AS UNSIGNED) as received")
                ->addBinding(array_merge($phoneNumbers, $phoneNumbers), 'select')
                ->whereBetween('created_at', [$this->startDate->startOfMonth(), $this->endDate->endOfMonth()])
                ->groupBy('month')
                ->orderBy('month', 'ASC');
    }

    private function getCategoriesSMS(?Message $message): Collection
    {
        return $this->getMessageTypePerMonth($message);
    }

    private function getCategoriesMMS(?Message $message): Collection
    {
        return $this->getMessageTypePerMonth($message);
    }

    private function getMessageTypePerMonth(?Message $message): Collection
    {
        $data = $message ?: collect(['month' => $this->currentMonth, 'sent' => 0, 'received' => 0]);
        
        $formattedData = collect($data->toArray())->except('month')->map(fn($value, $key) => ['key' => $key, 'count' => (int) $value])->values();

        return collect([
            'month' => Carbon::parse($this->currentMonth)->format('M Y'),
            'data' => $formattedData,
        ]);
    }

    private function categoriesUserCharts(): Collection
    {
        $data = User::query()
            ->leftJoin('subscriptions', 'subscriptions.user_id', '=', 'users.id')
            ->selectRaw("SUM(CASE WHEN subscriptions.id IS NOT NULL THEN 1 ELSE 0 END) as subscription,
                        SUM(CASE WHEN subscriptions.id IS NULL THEN 1 ELSE 0 END) as trial,
                        SUM(CASE WHEN subscriptions.expired_at <= NOW() THEN 1 ELSE 0 END) as expired")
            ->whereBetween('users.created_at', [$this->startDate->startOfMonth(), $this->endDate->endOfMonth()])
            ->first()
            ->toArray();

        $formattedData = collect($data)->map(fn($value, $key) => ['key' => $key, 'users' => (int) $value])->values();

        return collect([
            'month' => Carbon::parse($this->currentMonth)->format('M Y'),
            'data' => $formattedData,
        ]);
    }

    private function categoriesOrderCharts(Collection $orderStatuses, Collection $ordersPerMonth): Collection
    {
        $currentMonthData = $ordersPerMonth->get($this->currentMonth, collect([]));

        $formattedData = $orderStatuses->map(fn($status) => [
            'key' => $status,
            'orders' => (int) ($currentMonthData->firstWhere('status', $status)->count ?? 0),
        ])->values();

        return collect([
            'month' => Carbon::now()->format('M Y'),
            'data' => $formattedData,
        ]);
    }

    private function formatCharts(Collection $charts): array
    {
        return [
            'data' => $charts,
            'startDate' => $this->startDate->format('M Y'),
            'endDate' => $this->endDate->format('M Y'),
        ];
    }

    private function formatMonthlyData(Collection $dataPerMonth): Collection
    {
        return collect(range(0, 11))->map(function ($i) use ($dataPerMonth) {
            $date = Carbon::now()->subMonths($i)->format('Y-m');
            return [
                'month' => Carbon::createFromFormat('Y-m', $date)->format('M Y'),
                'users' => $dataPerMonth[$date] ?? 0,
            ];
        })->reverse()->values();
    }

    private function formatOrderChartsData(Collection $ordersPerMonth, Collection $orderStatuses): Collection
    {
        return collect(range(0, 11))->map(function ($i) use ($ordersPerMonth, $orderStatuses) {
            $date = Carbon::now()->subMonths($i)->format('Y-m');
            $monthlyData = $ordersPerMonth[$date] ?? collect([]);

            return array_merge(
                ['month' => Carbon::createFromFormat('Y-m', $date)->format('M Y')],
                $orderStatuses->mapWithKeys(fn($status) => [$status => (int) ($monthlyData->firstWhere('status', $status)->count ?? 0)])
                    ->toArray()
            );
        })->reverse()->values();
    }

    private function getProfitData(Message $smsPerMonth, Message $mmsPerMonth): Collection
    {
        $totalSales = Order::query()
            ->whereBetween('created_at', [$this->startDate, $this->endDate])
            ->whereStatus(Status::COMPLETED)
            ->get(['period'])
            ->sum(fn ($order) => $order->period->details()['price']);

        $servicePrice = ServicePrice::query()->first();

        $totalConsumed = 0;

        if($servicePrice) {
            $smsPrice = ($smsPerMonth->sent * $servicePrice->outgoing_sms_price) +
            ($smsPerMonth->received * $servicePrice->incoming_sms_price);

            $mmsPrice = ($mmsPerMonth->sent * $servicePrice->outgoing_mms_price) +
                ($mmsPerMonth->received * $servicePrice->incoming_mms_price);

            $totalConsumed = $smsPrice + $mmsPrice;
        }

        $profit = $totalSales - $totalConsumed;

        return collect([
            'sales' => $totalSales,
            'consumed' => $totalConsumed,
            'profit' => $profit,
        ]);
    }
}
