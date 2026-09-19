<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Business tables that hold workspace-owned operational records.
     */
    private array $owned = [
        'raw_materials',
        'feed_products',
        'feed_formulas',
        'formula_items',
        'feed_formulations',
        'feed_formulation_items',
        'batch_settings',
        'production_batches',
        'production_batch_materials',
        'production_material_usages',
        'inventories',
        'stock_alerts',
        'buyers',
        'distributions',
        'distribution_items',
        'customers',
        'sales',
        'sale_items',
        'activity_logs',
        'forecast_records',
        'forecasts',
        'wastage_records',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('workspaces')) {
            Schema::create('workspaces', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }

        $tables = array_merge(['users'], $this->owned);

        foreach ($tables as $table) {
            if (! Schema::hasTable($table) || Schema::hasColumn($table, 'workspace_id')) {
                continue;
            }

            // A plain indexed column (rather than a foreign key) keeps this ALTER
            // portable across the MySQL production schema and SQLite installs.
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->unsignedBigInteger('workspace_id')->nullable()->index();
            });
        }

        // Move any pre-existing records into a single workspace so legacy data is
        // never orphaned. Fresh installs (no users) skip this entirely.
        if (! Schema::hasTable('users') || DB::table('users')->count() === 0) {
            return;
        }

        $workspaceId = DB::table('workspaces')->insertGetId([
            'name' => 'Default Workspace',
            'owner_id' => DB::table('users')->where('role', 'super_admin')->orderBy('id')->value('id'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->whereNull('workspace_id')->update(['workspace_id' => $workspaceId]);

        foreach ($this->owned as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'workspace_id')) {
                DB::table($table)->whereNull('workspace_id')->update(['workspace_id' => $workspaceId]);
            }
        }
    }

    public function down(): void
    {
        foreach (array_merge(['users'], $this->owned) as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'workspace_id')) {
                Schema::table($table, function (Blueprint $blueprint) {
                    $blueprint->dropColumn('workspace_id');
                });
            }
        }

        Schema::dropIfExists('workspaces');
    }
};
