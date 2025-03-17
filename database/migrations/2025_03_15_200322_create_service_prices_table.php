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
         Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table->double('incoming_sms_price')->nullable();
            $table->double('outgoing_sms_price')->nullable();
            $table->double('incoming_mms_price')->nullable();
            $table->double('outgoing_mms_price')->nullable();
            $table->double('incoming_call_price')->nullable();
            $table->double('outgoing_call_price')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_prices');
    }
};
