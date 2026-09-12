<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('buyers')) {
            return;
        }

        Schema::create('buyers', function (Blueprint $table) {
            $table->id();
            $table->string('buyer_code')->unique();
            $table->string('buyer_name');
            $table->string('contact_person')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->string('fishpond_or_cage_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyers');
    }
};
