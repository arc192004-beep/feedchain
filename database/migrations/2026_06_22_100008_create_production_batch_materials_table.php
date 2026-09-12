<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('production_batch_materials')) {
            return;
        }

        Schema::create('production_batch_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_batch_id')->constrained('production_batches')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->decimal('quantity_used', 15, 3)->default(0);
            $table->string('unit')->default('kg');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_batch_materials');
    }
};
