<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PaymentMethod>
 */
class PaymentMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['bkash', 'nagad', 'card', 'rocket', 'binance']),
            'account_number' => fake()->randomNumber(),
            'account_type' => fake()->randomElement(['personal', 'business', 'agent', 'regular', 'saving']),
        ];
    }
}