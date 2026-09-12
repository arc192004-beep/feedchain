<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'username')) {
                $table->string('username')->nullable()->after('name')->unique();
            }
        });

        DB::table('users')
            ->whereNull('username')
            ->orderBy('id')
            ->get(['id', 'email'])
            ->each(function ($user) {
                $base = Str::before($user->email, '@');
                $username = $base ?: 'user' . $user->id;

                $exists = DB::table('users')
                    ->where('username', $username)
                    ->where('id', '<>', $user->id)
                    ->exists();

                if ($exists) {
                    $username = $username . $user->id;
                }

                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['username' => $username]);
            });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'username')) {
                $table->dropUnique(['username']);
                $table->dropColumn('username');
            }
        });
    }
};
