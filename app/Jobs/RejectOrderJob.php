<?php

namespace App\Jobs;

use App\Mail\OrderRejectMail;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class RejectOrderJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private Order $order, 
        private string $reason,
    ){}


    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->order->user)->send(new OrderRejectMail($this->order, $this->reason));
    }
}
