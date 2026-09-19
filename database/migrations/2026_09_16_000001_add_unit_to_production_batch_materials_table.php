<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('production_batch_materials') && ! Schema::hasColumn('production_batch_materials', 'unit')) {
            Schema::table('production_batch_materials', function (Blueprint $table) {
                $table->string('unit')->default('kg')->after('quantity_used');
            });
        }

        // Backfill unit from raw_materials for any existing records. The legacy
        // database is MySQL; the JOIN form is skipped on other drivers where the
        // schema starts empty anyway.
        if (Schema::hasTable('production_batch_materials') && Schema::hasTable('raw_materials')
            && DB::connection()->getDriverName() === 'mysql') {
            DB::statement("
                UPDATE production_batch_materials pbm
                JOIN raw_materials rm ON rm.id = pbm.raw_material_id
                SET pbm.unit = COALESCE(NULLIF(rm.unit, ''), 'kg')
                WHERE pbm.unit IS NULL OR pbm.unit = ''
            ");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('production_batch_materials') && Schema::hasColumn('production_batch_materials', 'unit')) {
            Schema::table('production_batch_materials', function (Blueprint $table) {
                $table->dropColumn('unit');
            });
        }
    }
};
