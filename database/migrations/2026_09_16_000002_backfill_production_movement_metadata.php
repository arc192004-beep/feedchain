<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasTable('inventories')) {
            return;
        }

        // Enrich legacy batch-ledger rows in place; no stock is recalculated and
        // no movement is duplicated. The multi-table UPDATE is MySQL-specific.
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("UPDATE inventories i JOIN production_batches pb ON pb.id = i.reference_batch_id LEFT JOIN feed_products fp ON fp.id = i.feed_product_id SET i.movement_type = CASE WHEN i.inventory_type = 'finished_product' AND i.quantity < 0 THEN 'Production Reversal' WHEN i.inventory_type = 'raw_material' AND i.quantity > 0 THEN 'Production Reversal' ELSE 'Production' END, i.reference_number = pb.batch_number, i.user_id = pb.encoded_by, i.quantity_kg = CASE WHEN i.inventory_type = 'finished_product' THEN i.quantity * COALESCE(fp.bag_weight_kg, 25) ELSE i.quantity END WHERE i.reference_batch_id IS NOT NULL AND i.movement_type IS NULL");
    }

    public function down(): void
    {
        // Audit metadata is intentionally retained.
    }
};
