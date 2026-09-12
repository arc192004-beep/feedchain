<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('raw_materials', function (Blueprint $table) {
            if (! Schema::hasColumn('raw_materials', 'material_name')) {
                $table->string('material_name')->nullable();
            }
            if (! Schema::hasColumn('raw_materials', 'material_type')) {
                $table->string('material_type')->nullable();
            }
        });

        DB::table('raw_materials')
            ->where(function ($query) {
                $query->whereNull('material_name')->orWhere('material_name', '');
            })
            ->update(['material_name' => DB::raw('name')]);

        DB::table('raw_materials')
            ->where(function ($query) {
                $query->whereNull('material_type')->orWhere('material_type', '');
            })
            ->update(['material_type' => DB::raw('category')]);

        DB::table('raw_materials')
            ->where('quantity_on_hand', 0)
            ->update(['quantity_on_hand' => DB::raw('quantity')]);

        DB::table('raw_materials')
            ->where('cost_per_unit', 0)
            ->update(['cost_per_unit' => DB::raw('unit_cost')]);
    }

    public function down(): void
    {
        // Existing material data is preserved; this data migration is not reversed.
    }
};
