<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\PhoneNumber;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);


        User::factory(4)->create();
        PhoneNumber::factory(10)->create();
        Conversation::factory(50)->create();
        Message::factory(100)->create();

        Conversation::with('messages')->get()->each(function ($conversation) {
            if ($conversation->messages->isNotEmpty()) {
                $conversation->update([
                    'last_message_id' => $conversation->messages->last()->id
                ]);
            }
        });
    }
}
