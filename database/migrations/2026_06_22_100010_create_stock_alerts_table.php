<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('stock_alerts')) {
            return;
        }

        Schema::create('stock_alerts', function (Blueprint $table) {
            $table->id();
            $table->enum('inventory_type', ['raw_material', 'finished_product']);
            $table->foreignId('raw_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
            $table->foreignId('feed_product_id')->nullable()->constrained('feed_products')->nullOnDelete();
            $table->decimal('current_quantity', 15, 3)->default(0);
            $table->decimal('threshold_quantity', 15, 3)->default(0);
            $table->string('alert_level'); // e.g., low_stock, critical_stock
            $table->text('alert_message')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_alerts');
    }
};
