<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->string('material_code')->unique();
            $table->string('material_name');
            $table->string('material_type');
            $table->string('unit')->default('kg');
            $table->decimal('current_stock', 15, 3)->default(0);
            $table->decimal('reorder_level', 15, 3)->default(0);
            $table->decimal('critical_level', 15, 3)->default(0);
            $table->date('expiration_date')->nullable();
            $table->string('supplier_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raw_materials');
    }
};
