<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Business codes are unique *within a workspace*, not globally.
     *
     * The original schema created global unique indexes, which coupled
     * independent workspaces: a code used in one workspace could not be reused
     * in another, and duplicate-code validation messages leaked the existence
     * of records owned by a different workspace. Scoping the index to
     * (workspace_id, code) restores isolation while keeping the code unique
     * inside each workspace.
     */
    private array $codes = [
        'raw_materials' => 'material_code',
        'feed_products' => 'product_code',
        'feed_formulas' => 'formula_code',
        'production_batches' => 'batch_number',
        'buyers' => 'buyer_code',
        'distributions' => 'distribution_number',
        'customers' => 'customer_code',
        'sales' => 'sales_number',
    ];

    public function up(): void
    {
        foreach ($this->codes as $table => $column) {
            if (! Schema::hasTable($table) || ! Schema::hasColumn($table, 'workspace_id')) {
                continue;
            }

            $legacyIndex = "{$table}_{$column}_unique";

            if (Schema::hasIndex($table, $legacyIndex)) {
                Schema::table($table, function (Blueprint $blueprint) use ($legacyIndex) {
                    $blueprint->dropUnique($legacyIndex);
                });
            }

            $scopedIndex = "{$table}_workspace_id_{$column}_unique";

            if (! Schema::hasIndex($table, $scopedIndex)) {
                Schema::table($table, function (Blueprint $blueprint) use ($column, $scopedIndex) {
                    $blueprint->unique(['workspace_id', $column], $scopedIndex);
                });
            }
        }
    }

    public function down(): void
    {
        foreach ($this->codes as $table => $column) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            $scopedIndex = "{$table}_workspace_id_{$column}_unique";

            if (Schema::hasIndex($table, $scopedIndex)) {
                Schema::table($table, function (Blueprint $blueprint) use ($scopedIndex) {
                    $blueprint->dropUnique($scopedIndex);
                });
            }

            // Reinstating a global unique index is impossible once two
            // workspaces legitimately share a code. Skip it rather than crash
            // the rollback; the duplicate rows would have to be reconciled
            // manually first.
            if ($this->hasDuplicateCodes($table, $column)) {
                continue;
            }

            if (! Schema::hasIndex($table, "{$table}_{$column}_unique")) {
                Schema::table($table, function (Blueprint $blueprint) use ($column, $table) {
                    $blueprint->unique($column, "{$table}_{$column}_unique");
                });
            }
        }
    }

    private function hasDuplicateCodes(string $table, string $column): bool
    {
        return DB::table($table)
            ->select($column)
            ->whereNotNull($column)
            ->groupBy($column)
            ->havingRaw('COUNT(*) > 1')
            ->exists();
    }
};
