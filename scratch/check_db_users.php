<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Workspace;

echo "Total Workspaces: " . Workspace::count() . "\n";
echo "Total Users: " . User::count() . "\n";
echo "Super Admins count: " . User::where('role', 'super_admin')->count() . "\n";
foreach (User::all() as $u) {
    echo "User: id={$u->id}, name={$u->name}, username={$u->username}, email={$u->email}, role={$u->role}, ws={$u->workspace_id}\n";
}
