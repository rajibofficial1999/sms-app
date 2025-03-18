<?php

namespace App\Jobs;

use App\Mail\PlaceOrderMail;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class PlaceOrderJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private User $user, private Order $order)
    {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->user)->send(new PlaceOrderMail($this->user, $this->order));
    }
}
