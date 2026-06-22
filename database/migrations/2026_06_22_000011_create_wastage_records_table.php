<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wastage_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('raw_material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
            $table->foreignId('production_batch_id')->nullable()->constrained('production_batches')->nullOnDelete();
            $table->enum('wastage_type', ['expired','damaged','unused','variance']);
            $table->decimal('quantity', 15, 3)->default(0);
            $table->text('remarks')->nullable();
            $table->date('date_recorded');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wastage_records');
    }
};
