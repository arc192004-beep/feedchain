<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distributions', function (Blueprint $table) {
            $table->id();
            $table->string('distribution_number')->unique();
            $table->foreignId('buyer_id')->constrained('buyers')->cascadeOnDelete();
            $table->date('distribution_date');
            $table->decimal('total_quantity', 15, 3)->default(0);
            $table->text('remarks')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('encoded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distributions');
    }
};
