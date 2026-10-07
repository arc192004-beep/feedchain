<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('customers') && ! Schema::hasColumn('customers', 'customer_code')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->string('customer_code')->nullable()->after('id');
            });

            // Backfill customer_code for existing customers
            $customers = DB::table('customers')->orderBy('id')->get();
            foreach ($customers as $customer) {
                $workspaceId = $customer->workspace_id ?? 1;
                $code = 'CUST-' . $workspaceId . '-' . str_pad((string) $customer->id, 4, '0', STR_PAD_LEFT);
                DB::table('customers')->where('id', $customer->id)->update([
                    'customer_code' => $code,
                ]);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('customers') && Schema::hasColumn('customers', 'customer_code')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->dropColumn('customer_code');
            });
        }
    }
};
