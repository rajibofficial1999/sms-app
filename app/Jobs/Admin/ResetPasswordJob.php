<?php

namespace App\Jobs\Admin;

use App\Mail\Admin\ResetPasswordMail;
use App\Models\Admin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class ResetPasswordJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $token, public Admin $admin)
    {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $url = url(config('app.url') . route('admin.password.reset', ['token' => $this->token], false));

        $url = "{$url}?email={$this->admin->email}";

        Mail::to($this->admin)->send(new ResetPasswordMail($this->admin, $url));
    }
}
