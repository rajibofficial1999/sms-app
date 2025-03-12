<?php

namespace App\Jobs\Admin;

use App\Mail\Admin\SendEmailVerificationMail;
use App\Models\Admin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendEmailVerificationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Admin $user)  
    {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $code = $this->user->createEmailVerificationCode();
        Mail::to($this->user)->send(new SendEmailVerificationMail($this->user, $code));
    }
}
