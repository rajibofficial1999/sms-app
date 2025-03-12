<?php

namespace App\Jobs;

use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class ResetPasswordJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $token, public User $user)
    {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $url = url(config('app.url') . route('password.reset', ['token' => $this->token], false));

        $url = "{$url}?email={$this->user->email}";

        Mail::to($this->user)->send(new ResetPasswordMail($this->user, $url));
    }
}
