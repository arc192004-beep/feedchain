<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;

$user = User::where('role', 'production_manager')->orWhere('role', 'super_admin')->first();
auth()->login($user);

// 1. Test POST with 'name' (React SPA UI format)
$request1 = Request::create('/customers', 'POST', [
    'name' => 'UI Simulated Customer',
    'address' => '999 Fishery Boulevard',
    'contact_number' => '09112223334',
    'status' => 'active',
]);
$request1->headers->set('Accept', 'application/json');

$response1 = $kernel->handle($request1);
echo "STATUS JSON API: " . $response1->getStatusCode() . "\n";
echo "BODY JSON API: " . $response1->getContent() . "\n";

$savedJson = json_decode($response1->getContent(), true);
$id = $savedJson['id'] ?? null;

if ($id) {
    $dbRecord = Customer::find($id);
    echo "VERIFIED IN DB:\n";
    echo "ID: " . $dbRecord->id . "\n";
    echo "Name: " . $dbRecord->name . "\n";
    echo "Code: " . $dbRecord->customer_code . "\n";
    echo "Workspace ID: " . $dbRecord->workspace_id . "\n";
    echo "Address: " . $dbRecord->address . "\n";
    echo "Phone: " . $dbRecord->contact_number . "\n";
    $dbRecord->delete();
    echo "CLEANUP DONE.\n";
}
