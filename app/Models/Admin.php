<?php

namespace App\Models;

use App\Jobs\Admin\ResetPasswordJob;
use App\Jobs\Admin\SendEmailVerificationJob;
use App\Traits\HasVerificationCodes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Admin extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, HasRoles, HasVerificationCodes;

    // Define the guard for this model to 'admin' to use the custom guard
    protected $guard = 'admin';
    protected $guard_name = 'admin';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'status',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function sendEmailVerificationNotification()
    {
        dispatch(new SendEmailVerificationJob($this));
    }

    public function sendPasswordResetNotification($token)
    {
        dispatch(new ResetPasswordJob($token, $this));
    }
}
