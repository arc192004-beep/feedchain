<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_no')->unique();
            $table->foreignId('feed_product_id')->constrained('feed_products')->cascadeOnDelete();
            $table->foreignId('feed_formulation_id')->constrained('feed_formulations')->cascadeOnDelete();
            $table->foreignId('batch_setting_id')->nullable()->constrained('batch_settings')->nullOnDelete();
            $table->date('production_date');
            $table->decimal('quantity_kg', 12, 3);
            $table->integer('sacks_produced')->default(0);
            $table->enum('status', ['planned','in_progress','completed','cancelled'])->default('planned');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_batches');
    }
};
