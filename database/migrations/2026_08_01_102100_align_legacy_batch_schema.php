<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('production_batches', function (Blueprint $table) {
            if (! Schema::hasColumn('production_batches', 'feed_product_id')) {
                $table->unsignedBigInteger('feed_product_id')->nullable()->after('batch_number');
            }
            if (! Schema::hasColumn('production_batches', 'batch_setting_id')) {
                $table->unsignedBigInteger('batch_setting_id')->nullable();
            }
            if (! Schema::hasColumn('production_batches', 'quantity_kg')) {
                $table->decimal('quantity_kg', 12, 3)->default(0);
            }
            if (! Schema::hasColumn('production_batches', 'sacks_produced')) {
                $table->integer('sacks_produced')->default(0);
            }
            if (! Schema::hasColumn('production_batches', 'total_raw_material_used')) {
                $table->decimal('total_raw_material_used', 15, 3)->default(0);
            }
            if (! Schema::hasColumn('production_batches', 'encoded_by')) {
                $table->unsignedBigInteger('encoded_by')->nullable();
            }
        });

        Schema::table('feed_formulas', function (Blueprint $table) {
            if (! Schema::hasColumn('feed_formulas', 'formula_name')) {
                $table->string('formula_name')->nullable();
            }
            if (! Schema::hasColumn('feed_formulas', 'batch_size_kg')) {
                $table->decimal('batch_size_kg', 12, 3)->default(1000);
            }
        });

        Schema::table('formula_items', function (Blueprint $table) {
            if (! Schema::hasColumn('formula_items', 'unit')) {
                $table->string('unit')->default('kg');
            }
        });

        Schema::table('inventories', function (Blueprint $table) {
            if (! Schema::hasColumn('inventories', 'reference_batch_id')) {
                $table->unsignedBigInteger('reference_batch_id')->nullable();
            }
            if (! Schema::hasColumn('inventories', 'quantity_available')) {
                $table->decimal('quantity_available', 15, 3)->default(0);
            }
            if (! Schema::hasColumn('inventories', 'unit')) {
                $table->string('unit')->default('kg');
            }
            if (! Schema::hasColumn('inventories', 'last_updated')) {
                $table->timestamp('last_updated')->nullable();
            }
        });

        DB::table('production_batches')
            ->where('quantity_kg', 0)
            ->update(['quantity_kg' => DB::raw('quantity_produced')]);

        DB::table('production_batches')
            ->where('sacks_produced', 0)
            ->update(['sacks_produced' => DB::raw('total_sacks')]);

        DB::table('feed_formulas')
            ->whereNull('formula_name')
            ->update(['formula_name' => DB::raw('name')]);

        DB::table('feed_formulas')
            ->where('batch_size_kg', 1000)
            ->update(['batch_size_kg' => DB::raw('batch_size')]);
    }

    public function down(): void
    {
        // This migration intentionally preserves legacy data and columns.
    }
};
