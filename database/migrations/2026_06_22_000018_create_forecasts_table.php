<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forecasts', function (Blueprint $table) {
            $table->id();
            $table->enum('forecast_type', ['production','raw_material']);
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('forecast_period');
            $table->decimal('predicted_value', 18, 3);
            $table->string('model_used')->default('Linear Regression');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forecasts');
    }
};
