<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forecast_records', function (Blueprint $table) {
            $table->id();
            $table->string('forecast_type'); // e.g., 'production', 'raw_material'
            $table->string('reference_period'); // e.g., '2026-07'
            $table->decimal('predicted_value', 18, 3);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forecast_records');
    }
};
