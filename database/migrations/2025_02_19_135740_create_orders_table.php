<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('account_holder_name');
            $table->enum('period', ['monthly', 'weekly', 'yearly']);
            $table->integer('area_code')->nullable();
            $table->foreignId('payment_method_id')->constrained('payment_methods');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('payment_screenshot');
            $table->enum('status', ['pending', 'completed', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    { 
        Schema::dropIfExists('orders');
    }
};
