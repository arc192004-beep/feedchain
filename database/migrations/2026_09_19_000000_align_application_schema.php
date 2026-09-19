<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The original FeedChain database was created outside Laravel, so several
 * columns the application relies on were never present in the shipped
 * migrations. This adds the missing columns, mirroring the existing
 * `align_legacy_*` migrations, so a fresh install behaves like production.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            if (! Schema::hasColumn('inventories', 'quantity')) {
                $table->decimal('quantity', 15, 3)->default(0);
            }
        });

        Schema::table('production_batch_materials', function (Blueprint $table) {
            if (! Schema::hasColumn('production_batch_materials', 'unit_cost')) {
                $table->decimal('unit_cost', 12, 2)->default(0);
            }
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            // The ActivityLog model maps action/module onto the legacy
            // log_name/properties columns.
            if (! Schema::hasColumn('activity_logs', 'log_name')) {
                $table->string('log_name')->nullable();
            }
            if (! Schema::hasColumn('activity_logs', 'properties')) {
                $table->text('properties')->nullable();
            }
        });

        // These legacy NOT NULL columns are never written by the application.
        if (Schema::hasColumn('activity_logs', 'action')) {
            Schema::table('activity_logs', function (Blueprint $table) {
                $table->string('action')->nullable()->change();
            });
        }

        if (Schema::hasColumn('activity_logs', 'module')) {
            Schema::table('activity_logs', function (Blueprint $table) {
                $table->string('module')->nullable()->change();
            });
        }

        if (Schema::hasColumn('production_batches', 'total_raw_material_used')) {
            Schema::table('production_batches', function (Blueprint $table) {
                $table->decimal('total_raw_material_used', 15, 3)->default(0)->change();
            });
        }

        Schema::table('production_batches', function (Blueprint $table) {
            if (! Schema::hasColumn('production_batches', 'completed_at')) {
                $table->timestamp('completed_at')->nullable();
            }
            if (! Schema::hasColumn('production_batches', 'started_at')) {
                $table->timestamp('started_at')->nullable();
            }
            if (! Schema::hasColumn('production_batches', 'notes')) {
                $table->text('notes')->nullable();
            }
        });

        Schema::table('customers', function (Blueprint $table) {
            if (! Schema::hasColumn('customers', 'name')) {
                $table->string('name')->nullable();
            }
            if (! Schema::hasColumn('customers', 'fish_cage')) {
                $table->string('fish_cage')->nullable();
            }
            if (! Schema::hasColumn('customers', 'email')) {
                $table->string('email')->nullable();
            }
            if (! Schema::hasColumn('customers', 'status')) {
                $table->string('status')->default('active');
            }
        });

        Schema::table('sales', function (Blueprint $table) {
            if (! Schema::hasColumn('sales', 'sale_date')) {
                $table->date('sale_date')->nullable();
            }
            if (! Schema::hasColumn('sales', 'feed_product_id')) {
                $table->unsignedBigInteger('feed_product_id')->nullable();
            }
            if (! Schema::hasColumn('sales', 'quantity')) {
                $table->decimal('quantity', 15, 3)->default(0);
            }
            if (! Schema::hasColumn('sales', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (! Schema::hasColumn('sales', 'customer_name')) {
                $table->string('customer_name')->nullable();
            }
        });

        Schema::table('distribution_items', function (Blueprint $table) {
            if (! Schema::hasColumn('distribution_items', 'unit_price')) {
                $table->decimal('unit_price', 10, 2)->default(0);
            }
            if (! Schema::hasColumn('distribution_items', 'line_total')) {
                $table->decimal('line_total', 18, 2)->default(0);
            }
            if (! Schema::hasColumn('distribution_items', 'subtotal')) {
                $table->decimal('subtotal', 18, 2)->default(0);
            }
        });

        Schema::table('distributions', function (Blueprint $table) {
            if (! Schema::hasColumn('distributions', 'transaction_number')) {
                $table->string('transaction_number')->nullable();
            }
            if (! Schema::hasColumn('distributions', 'buyer_name')) {
                $table->string('buyer_name')->nullable();
            }
            if (! Schema::hasColumn('distributions', 'address')) {
                $table->text('address')->nullable();
            }
            if (! Schema::hasColumn('distributions', 'contact_number')) {
                $table->string('contact_number')->nullable();
            }
            if (! Schema::hasColumn('distributions', 'delivery_date')) {
                $table->date('delivery_date')->nullable();
            }
            if (! Schema::hasColumn('distributions', 'total_amount')) {
                $table->decimal('total_amount', 18, 2)->default(0);
            }
            if (! Schema::hasColumn('distributions', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable();
            }
        });

        // The application never writes these legacy NOT NULL columns, so add
        // them as nullable/have defaults rather than rewriting application code.
        Schema::table('feed_products', function (Blueprint $table) {
            if (! Schema::hasColumn('feed_products', 'name')) {
                $table->string('name')->nullable();
            }
        });

        Schema::table('feed_formulas', function (Blueprint $table) {
            if (! Schema::hasColumn('feed_formulas', 'name')) {
                $table->string('name')->nullable();
            }
            if (! Schema::hasColumn('feed_formulas', 'batch_size')) {
                $table->decimal('batch_size', 12, 3)->default(1000);
            }
        });

        Schema::table('raw_materials', function (Blueprint $table) {
            if (! Schema::hasColumn('raw_materials', 'name')) {
                $table->string('name')->nullable();
            }
            if (! Schema::hasColumn('raw_materials', 'category')) {
                $table->string('category')->nullable();
            }
            if (! Schema::hasColumn('raw_materials', 'quantity')) {
                $table->decimal('quantity', 15, 3)->default(0);
            }
            if (! Schema::hasColumn('raw_materials', 'unit_cost')) {
                $table->decimal('unit_cost', 10, 2)->default(0);
            }
        });

        Schema::table('production_batches', function (Blueprint $table) {
            if (! Schema::hasColumn('production_batches', 'quantity_produced')) {
                $table->decimal('quantity_produced', 12, 3)->default(0);
            }
            if (! Schema::hasColumn('production_batches', 'total_sacks')) {
                $table->integer('total_sacks')->default(0);
            }
        });
    }

    public function down(): void
    {
        // Columns are intentionally preserved.
    }
};
