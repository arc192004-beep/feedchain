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
            $table->enum('item_type', ['raw_material','finished_product']);
            $table->foreignId('raw_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
            $table->foreignId('feed_product_id')->nullable()->constrained('feed_products')->nullOnDelete();
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->enum('movement_type', ['in','out','adjustment']);
            $table->decimal('quantity', 15, 3);
            $table->decimal('balance_after', 15, 3)->nullable();
            $table->text('remarks')->nullable();
            $table->dateTime('transaction_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
