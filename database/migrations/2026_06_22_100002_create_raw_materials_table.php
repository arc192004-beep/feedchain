<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('raw_materials')) {
            return;
        }

        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->string('material_code')->unique();
            $table->string('material_name');
            $table->string('material_type');
            $table->string('unit')->default('kg');
            $table->decimal('quantity_on_hand', 15, 3)->default(0);
            $table->decimal('reorder_level', 15, 3)->default(0);
            $table->decimal('cost_per_unit', 10, 2)->default(0);
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raw_materials');
    }
};
