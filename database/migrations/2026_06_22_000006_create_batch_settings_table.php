<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batch_settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_name');
            $table->foreignId('feed_product_id')->nullable()->constrained('feed_products')->nullOnDelete();
            $table->decimal('standard_batch_kg', 12, 3)->default(1000);
            $table->integer('sacks_per_batch')->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch_settings');
    }
};
