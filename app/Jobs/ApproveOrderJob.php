<?php

namespace App\Jobs;

use App\Mail\OrderApproveMail;
use App\Models\Order;
use App\Models\Subscription;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class ApproveOrderJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private Order $order, 
        private Subscription $subscription,
    ){}


    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $expired_at = $this->subscription->expired_at->format('d M Y h:i:s A');

        Mail::to($this->order->user)->send(new OrderApproveMail($this->order, $expired_at));
    }
}
