<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->enum('inventory_type', ['raw_material', 'finished_product']);
            $table->foreignId('raw_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
            $table->foreignId('feed_product_id')->nullable()->constrained('feed_products')->nullOnDelete();
            $table->foreignId('reference_batch_id')->nullable()->constrained('production_batches')->nullOnDelete();
            $table->decimal('quantity_available', 15, 3)->default(0);
            $table->string('unit')->default('kg');
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
