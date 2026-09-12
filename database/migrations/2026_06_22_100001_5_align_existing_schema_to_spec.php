<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('raw_materials')) {
            if (Schema::hasColumn('raw_materials', 'current_stock') && ! Schema::hasColumn('raw_materials', 'quantity_on_hand')) {
                DB::statement('ALTER TABLE raw_materials CHANGE current_stock quantity_on_hand DECIMAL(15,3) NOT NULL DEFAULT 0');
            }
            Schema::table('raw_materials', function (Blueprint $table) {
                if (! Schema::hasColumn('raw_materials', 'quantity_on_hand')) {
                    $table->decimal('quantity_on_hand', 15, 3)->default(0);
                }
                if (! Schema::hasColumn('raw_materials', 'cost_per_unit')) {
                    $table->decimal('cost_per_unit', 10, 2)->default(0);
                }
                if (! Schema::hasColumn('raw_materials', 'status')) {
                    $table->string('status')->default('active');
                }
            });
        }

        if (Schema::hasTable('feed_products')) {
            if (Schema::hasColumn('feed_products', 'feed_name') && ! Schema::hasColumn('feed_products', 'product_name')) {
                DB::statement('ALTER TABLE feed_products CHANGE feed_name product_name VARCHAR(255) NOT NULL');
            }
            Schema::table('feed_products', function (Blueprint $table) {
                if (! Schema::hasColumn('feed_products', 'product_name')) {
                    $table->string('product_name');
                }
                if (! Schema::hasColumn('feed_products', 'unit')) {
                    $table->string('unit')->default('kg');
                }
                if (! Schema::hasColumn('feed_products', 'price')) {
                    $table->decimal('price', 10, 2)->default(0);
                }
                if (! Schema::hasColumn('feed_products', 'status')) {
                    $table->string('status')->default('active');
                }
            });
        }

        if (Schema::hasTable('feed_formulations') && ! Schema::hasTable('feed_formulas')) {
            Schema::rename('feed_formulations', 'feed_formulas');
        }

        if (Schema::hasTable('feed_formulation_items') && ! Schema::hasTable('formula_items')) {
            Schema::rename('feed_formulation_items', 'formula_items');
        }

        if (Schema::hasTable('feed_formulas')) {
            Schema::table('feed_formulas', function (Blueprint $table) {
                if (! Schema::hasColumn('feed_formulas', 'formula_code')) {
                    $table->string('formula_code')->nullable()->unique();
                }
                if (! Schema::hasColumn('feed_formulas', 'status')) {
                    $table->string('status')->default('active');
                }
            });
        }

        if (Schema::hasTable('formula_items') && Schema::hasColumn('formula_items', 'feed_formulation_id')) {
            DB::statement('ALTER TABLE formula_items CHANGE feed_formulation_id feed_formula_id BIGINT UNSIGNED NOT NULL');
        }
    }

    public function down(): void
    {
        //
    }
};
