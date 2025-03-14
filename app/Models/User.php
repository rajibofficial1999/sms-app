<?php

namespace App\Models;

use App\Jobs\ResetPasswordJob;
use App\Jobs\SendEmailVerificationJob;
use App\Traits\HasVerificationCodes;
use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasVerificationCodes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function phoneNumber(): HasOne
    {
        return $this->hasOne(PhoneNumber::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function sendEmailVerificationNotification()
    {
        dispatch(new SendEmailVerificationJob($this));
    }

    public function sendPasswordResetNotification($token)
    {
        dispatch(new ResetPasswordJob($token, $this));
    }

    public function blockLists(): HasMany
    {
        return $this->hasMany(BlockList::class);
    }
}
