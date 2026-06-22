<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_products', function (Blueprint $table) {
            $table->id();
            $table->string('product_code')->unique();
            $table->string('feed_name');
            $table->string('feed_type');
            $table->text('description')->nullable();
            $table->decimal('unit_weight_kg', 8, 3)->default(1);
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_products');
    }
};
