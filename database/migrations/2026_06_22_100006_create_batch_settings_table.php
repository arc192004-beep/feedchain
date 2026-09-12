<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('batch_settings')) {
            return;
        }

        Schema::create('batch_settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_name');
            $table->decimal('batch_size_kg', 12, 3)->default(1000);
            $table->integer('sacks_equivalent')->default(0);
            $table->text('notes')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch_settings');
    }
};
