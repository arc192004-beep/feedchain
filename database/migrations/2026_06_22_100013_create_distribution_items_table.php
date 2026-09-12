<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('distribution_items')) {
            return;
        }

        Schema::create('distribution_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_id')->constrained('distributions')->cascadeOnDelete();
            $table->foreignId('feed_product_id')->constrained('feed_products')->cascadeOnDelete();
            $table->decimal('quantity', 15, 3);
            $table->string('unit')->default('kg');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribution_items');
    }
};
