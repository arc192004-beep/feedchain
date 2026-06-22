<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_formulas', function (Blueprint $table) {
            $table->id();
            $table->string('formula_code')->unique();
            $table->string('formula_name');
            $table->foreignId('feed_product_id')->constrained('feed_products')->cascadeOnDelete();
            $table->decimal('batch_size_kg', 12, 3)->default(1000);
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_formulas');
    }
};
