<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            if (! Schema::hasColumn('inventories', 'movement_type')) $table->string('movement_type')->nullable()->after('inventory_type');
            if (! Schema::hasColumn('inventories', 'reference_number')) $table->string('reference_number')->nullable()->after('reference_batch_id');
            if (! Schema::hasColumn('inventories', 'quantity_kg')) $table->decimal('quantity_kg', 15, 3)->nullable()->after('quantity');
            if (! Schema::hasColumn('inventories', 'user_id')) $table->unsignedBigInteger('user_id')->nullable()->after('reference_number');
        });

        Schema::table('production_batches', function (Blueprint $table) {
            if (! Schema::hasColumn('production_batches', 'inventory_applied_at')) $table->timestamp('inventory_applied_at')->nullable()->after('completed_at');
            if (! Schema::hasColumn('production_batches', 'production_yield')) $table->decimal('production_yield', 8, 2)->nullable()->after('total_raw_material_used');
        });

        // The alias/EXISTS form and the JOIN-based backfills below target the legacy
        // MySQL database; skipping them elsewhere keeps fresh installs working.
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("UPDATE production_batches pb SET inventory_applied_at = COALESCE(inventory_applied_at, completed_at, updated_at) WHERE status = 'completed' AND EXISTS (SELECT 1 FROM inventories i WHERE i.reference_batch_id = pb.id AND i.inventory_type = 'finished_product' AND i.quantity > 0)");
        }

        if (Schema::hasColumn('production_batches', 'completed_at') && Schema::hasColumn('production_batches', 'total_raw_material_used')) {
            DB::statement("UPDATE production_batches SET production_yield = CASE WHEN total_raw_material_used > 0 THEN ROUND((quantity_kg / total_raw_material_used) * 100, 2) ELSE 100.00 END WHERE production_yield IS NULL AND status = 'completed'");
        }
    }

    public function down(): void
    {
        // Keep audit history when rolling back application code.
    }
};
