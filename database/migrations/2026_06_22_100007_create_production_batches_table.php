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
            $table->string('batch_number')->unique();
            $table->foreignId('feed_product_id')->constrained('feed_products')->cascadeOnDelete();
            $table->foreignId('feed_formula_id')->constrained('feed_formulas')->cascadeOnDelete();
            $table->foreignId('batch_setting_id')->nullable()->constrained('batch_settings')->nullOnDelete();
            $table->date('production_date');
            $table->decimal('quantity_kg', 12, 3);
            $table->integer('sacks_produced')->default(0);
            $table->decimal('total_raw_material_used', 15, 3)->default(0);
            $table->string('status')->default('pending');
            $table->foreignId('encoded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_batches');
    }
};
