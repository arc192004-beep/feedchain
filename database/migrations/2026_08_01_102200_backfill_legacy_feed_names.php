<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('feed_products', 'name')) {
            DB::table('feed_products')
                ->where(function ($query) {
                    $query->whereNull('product_name')->orWhere('product_name', '');
                })
                ->update(['product_name' => DB::raw('name')]);
        }

        if (Schema::hasColumn('feed_formulas', 'name')) {
            DB::table('feed_formulas')
                ->where(function ($query) {
                    $query->whereNull('formula_name')->orWhere('formula_name', '');
                })
                ->update(['formula_name' => DB::raw('name')]);
        }
    }

    public function down(): void
    {
        // Existing names are preserved; this data migration is not reversed.
    }
};
