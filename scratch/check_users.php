<?php
define('LARAVEL_START', microtime(true));
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$exists = App\Models\User::where('role', 'super_admin')->exists();
echo 'super_admin_exists: ' . ($exists ? 'YES' : 'NO') . PHP_EOL;
echo 'total_users: ' . App\Models\User::count() . PHP_EOL;

foreach (App\Models\User::select('id', 'name', 'email', 'role', 'status')->get() as $u) {
    echo $u->id . ' | ' . $u->name . ' | ' . $u->email . ' | ' . $u->role . ' | ' . $u->status . PHP_EOL;
}
