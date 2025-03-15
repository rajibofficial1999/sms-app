<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\PaymentMethod;
use App\Models\PhoneNumber;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $admin = Admin::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => 'password',
            'email_verified_at' => Carbon::now(),
        ]);

        $superAdmin = Admin::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@admin.com',
            'password' => 'password',
            'email_verified_at' => Carbon::now(),
        ]);

        $adminRole = Role::create([
            'name' => 'Admin',
            'guard_name' => 'admin',
        ]);

        $superAdminRole = Role::create([
            'name' => 'Super admin',
            'guard_name' => 'admin',
        ]);

        $superAdmin->assignRole($superAdminRole);
        $admin->assignRole($adminRole);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory(4)->create();
        $users = User::all();
        $users->each(function ($user) {
            PhoneNumber::factory()->create([
                'user_id' => $user->id,
            ]);
        });

        Conversation::factory(50)->create();
        Message::factory(100)->create();

        $accountTypes = ['personal', 'business', 'agent', 'regular', 'saving'];

        collect(['bkash', 'nagad', 'card', 'rocket', 'binance'])->each(function ($type, $index) use ($accountTypes) {
            PaymentMethod::create([
                'type' => $type,
                'account_number' => rand(11111111111, 99999999999),
                'account_type' => $accountTypes[$index],
                'logo' => "https://picsum.photos/id/{$index}/200/200",
            ]);

        });

        Conversation::with('messages')->get()->each(function ($conversation) {
            if ($conversation->messages->isNotEmpty()) {
                $conversation->update([
                    'last_message_id' => $conversation->messages->last()->id
                ]);
            }
        });
    }
}
