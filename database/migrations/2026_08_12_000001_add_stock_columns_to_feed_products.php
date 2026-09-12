<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('feed_products', function (Blueprint $table) {
            if (!Schema::hasColumn('feed_products', 'quantity_bags')) $table->decimal('quantity_bags', 12, 3)->default(0);
            if (!Schema::hasColumn('feed_products', 'min_stock_bags')) $table->decimal('min_stock_bags', 12, 3)->default(0);
            if (!Schema::hasColumn('feed_products', 'bag_weight_kg')) $table->decimal('bag_weight_kg', 12, 3)->default(25);
        });
    }

    public function down(): void
    {
        Schema::table('feed_products', function (Blueprint $table) {
            foreach (['quantity_bags', 'min_stock_bags', 'bag_weight_kg'] as $column) {
                if (Schema::hasColumn('feed_products', $column)) $table->dropColumn($column);
            }
        });
    }
};
