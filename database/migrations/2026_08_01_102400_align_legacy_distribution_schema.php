<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distributions', function (Blueprint $table) {
            if (! Schema::hasColumn('distributions', 'distribution_number')) $table->string('distribution_number')->nullable();
            if (! Schema::hasColumn('distributions', 'buyer_id')) $table->unsignedBigInteger('buyer_id')->nullable();
            if (! Schema::hasColumn('distributions', 'distribution_date')) $table->date('distribution_date')->nullable();
            if (! Schema::hasColumn('distributions', 'total_quantity')) $table->decimal('total_quantity', 15, 3)->default(0);
            if (! Schema::hasColumn('distributions', 'remarks')) $table->text('remarks')->nullable();
            if (! Schema::hasColumn('distributions', 'encoded_by')) $table->unsignedBigInteger('encoded_by')->nullable();
        });
    }

    public function down(): void
    {
        // Legacy distribution data is preserved.
    }
};
