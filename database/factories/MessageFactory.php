<?php

namespace Database\Factories;

use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $randomConversation = Conversation::inRandomOrder()->first();
        return [
            'body' => fake()->sentence(),
            'conversation_id' => $randomConversation->id,
            'sender_number' => fake()->randomElement([$randomConversation->localNumber->number, $randomConversation->traffic_number]),
        ];
    }
}
