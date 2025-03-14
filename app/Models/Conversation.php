<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'local_number_id',
        'traffic_number',
        'last_message_id',
        'avatar_color',
    ];

    protected $appends = ['is_blocked'];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function unReadMessages()
    {
        return $this->messages;
    }

    public function localNumber(): BelongsTo
    {
        return $this->belongsTo(PhoneNumber::class, 'local_number_id');
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    protected static function booted()
    {
        static::boot();

        static::creating(function ($conversation) {
            $conversation->avatar_color = self::getRandomColor();
        });
    }

    private static function getRandomColor(): string
    {

        $colors = [
            "#FF5733", // Red-Orange
            "#FF8D1A", // Amber
            "#FFB300", // Yellow-Orange
            "#FFC300", // Yellow
            "#FFEE00", // Light Yellow
            "#C70039", // Crimson
            "#900C3F", // Dark Red
            "#581845", // Purple-Red
            "#900C3F", // Ruby Red
            "#DAF7A6", // Pale Green
            "#4CAF50", // Green
            "#33B5E5", // Cyan
            "#009688", // Teal
            "#2196F3", // Blue
            "#673AB7", // Purple
            "#8E24AA", // Pink
            "#D32F2F", // Red
            "#1976D2", // Blue-Gray
            "#FF5722", // Deep Orange
            "#795548", // Brown
        ];

        return $colors[array_rand($colors)];
    }

    public function blockList(): HasOne
    {
        return $this->hasOne(BlockList::class);
    }

    public function isBlocked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->blockList()->exists(),
        );
    }
}
