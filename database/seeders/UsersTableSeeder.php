<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'phone' => '09170000000',
                'address' => 'Head Office',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'pm@example.com'],
            [
                'name' => 'Production Manager',
                'password' => Hash::make('password'),
                'role' => 'production_manager',
                'phone' => '09170000001',
                'address' => 'Factory',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'administrator',
                'phone' => '09170000002',
                'address' => 'Office',
                'is_active' => true,
            ]
        );
    }
}
