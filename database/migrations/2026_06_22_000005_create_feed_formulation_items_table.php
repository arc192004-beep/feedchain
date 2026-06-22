<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_formulation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feed_formulation_id')->constrained('feed_formulations')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();
            $table->decimal('quantity_required', 12, 3)->default(0);
            $table->string('unit')->default('kg');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_formulation_items');
    }
};
