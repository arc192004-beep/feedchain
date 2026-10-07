<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Customer;
use App\Models\User;

$user = User::first();
auth()->login($user);

try {
    $c = Customer::create([
        'name' => 'Real Database Test Customer',
        'fish_cage' => 'Cage Real-1',
        'address' => '777 Ocean Parkway',
        'contact_number' => '09998887777',
        'email' => 'realcustomer@example.com',
        'status' => 'active',
    ]);
    echo "SUCCESS: Created customer:\n";
    echo "ID: " . $c->id . "\n";
    echo "Name: " . $c->name . "\n";
    echo "Code: " . $c->customer_code . "\n";
    echo "Workspace ID: " . $c->workspace_id . "\n";
    echo "Status: " . $c->status . "\n";
    echo "Address: " . $c->address . "\n";
    echo "Contact Number: " . $c->contact_number . "\n";
    
    // Check reading back from DB directly
    $fresh = Customer::find($c->id);
    echo "Fresh DB Name: " . $fresh->name . "\n";
    echo "Fresh DB Customer Name accessor: " . $fresh->customer_name . "\n";
    echo "Fresh DB Code: " . $fresh->customer_code . "\n";

    // Clean up test customer
    $c->delete();
    echo "CLEANUP: Customer deleted successfully.\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
