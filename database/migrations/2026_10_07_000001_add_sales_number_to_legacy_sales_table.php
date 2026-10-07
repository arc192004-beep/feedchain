<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sales')) {
            return;
        }

        if (! Schema::hasColumn('sales', 'sales_number')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->string('sales_number')->nullable()->after('id');
            });
        }

        DB::table('sales')
            ->whereNull('sales_number')
            ->orderBy('id')
            ->chunkById(500, function ($sales): void {
                foreach ($sales as $sale) {
                    $workspaceId = $sale->workspace_id ?? 0;
                    $salesNumber = 'SALE-'.$workspaceId.'-'.str_pad((string) $sale->id, 4, '0', STR_PAD_LEFT);

                    DB::table('sales')->where('id', $sale->id)->update([
                        'sales_number' => $salesNumber,
                    ]);
                }
            });

        if (Schema::hasColumn('sales', 'workspace_id')
            && ! Schema::hasIndex('sales', 'sales_workspace_id_sales_number_unique')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->unique(['workspace_id', 'sales_number'], 'sales_workspace_id_sales_number_unique');
            });
        }
    }

    public function down(): void
    {
        // Keep generated sales numbers so rolling back cannot erase receipt identifiers.
    }
};
