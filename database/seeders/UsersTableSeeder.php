<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['email' => 'superadmin@example.com', 'name' => 'Super Administrator', 'username' => 'superadmin', 'password' => 'password', 'role' => 'super_admin'],
            ['email' => 'pm@example.com', 'name' => 'Production Manager', 'username' => 'pm', 'password' => 'password', 'role' => 'production_manager'],
            ['email' => 'admin@example.com', 'name' => 'Administrator', 'username' => 'admin', 'password' => 'password', 'role' => 'administrator'],
        ];

        foreach ($users as $u) {
            $username = $this->makeUniqueUsername($u['username'], $u['email']);

            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'username' => $username,
                    'password' => Hash::make($u['password']),
                    'role' => $u['role'],
                    'status' => 'active',
                ]
            );
        }
    }

    /**
     * Generate a unique username by appending a numeric suffix when collisions exist.
     */
    private function makeUniqueUsername(string $base, string $email): string
    {
        $candidate = $base;
        $i = 1;

        while (DB::table('users')->where('username', $candidate)->where('email', '<>', $email)->exists()) {
            $candidate = $base . $i;
            $i++;
        }

        return $candidate;
    }
}
