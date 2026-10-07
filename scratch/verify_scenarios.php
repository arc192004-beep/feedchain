<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Workspace;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

echo "=== VERIFYING SCENARIOS ===\n\n";

DB::beginTransaction();

try {
    // -------------------------------------------------------------
    // SCENARIO A: Database has NO Super Admin
    // -------------------------------------------------------------
    echo "--- SCENARIO A: NO Super Admin in Database ---\n";
    
    // Temporarily update any existing super_admin to 'temp_admin' so count is 0
    DB::table('users')->where('role', 'super_admin')->update(['role' => 'temp_admin']);

    $hasSuperAdmin = User::where('role', 'super_admin')->exists();
    echo "Super admin exists: " . ($hasSuperAdmin ? 'YES' : 'NO') . "\n";

    // 1. Check Login page response
    $req = Request::create('/login', 'GET');
    $res = $kernel->handle($req);
    preg_match('/data-page="([^"]+)"/', $res->getContent(), $matches);
    $loginPageData = json_decode(htmlspecialchars_decode($matches[1]), true);
    
    echo "Login component: " . $loginPageData['component'] . "\n";
    echo "needsSuperAdminSetup prop: " . var_export($loginPageData['props']['needsSuperAdminSetup'], true) . "\n";

    if ($loginPageData['props']['needsSuperAdminSetup'] !== true) {
        throw new Exception("FAIL: needsSuperAdminSetup was expected to be true when no super admin exists!");
    }
    echo "✓ Login page correctly passes needsSuperAdminSetup = true\n";

    // 2. Check setup page accessibility when no super admin exists
    $setupReq = Request::create('/setup/super-admin', 'GET');
    $setupRes = $kernel->handle($setupReq);
    preg_match('/data-page="([^"]+)"/', $setupRes->getContent(), $setupMatches);
    $setupPageData = json_decode(htmlspecialchars_decode($setupMatches[1] ?? ''), true);

    echo "Setup page status: " . $setupRes->getStatusCode() . "\n";
    echo "Setup component: " . ($setupPageData['component'] ?? 'N/A') . "\n";

    if ($setupRes->getStatusCode() !== 200 || ($setupPageData['component'] ?? '') !== 'auth/setup-super-admin') {
        throw new Exception("FAIL: Setup page was not accessible when no super admin exists!");
    }
    echo "✓ Setup page is accessible (200 OK, auth/setup-super-admin)\n";

    // 3. Post to setup page to create first Super Admin
    $sessionStore = $app['session']->driver();
    $sessionStore->setId('test_session_scenario_a');
    $sessionStore->start();

    $postReq = Request::create('/setup/super-admin', 'POST', [
        'name' => 'First Super Admin',
        'username' => 'first_super_unique_99',
        'email' => 'first_super_unique_99@feedchain.test',
        'password' => 'SuperPassword123!',
        'password_confirmation' => 'SuperPassword123!',
    ]);
    $postReq->setLaravelSession($sessionStore);
    $postReq->headers->set('X-CSRF-TOKEN', $sessionStore->token());
    $postRes = $kernel->handle($postReq);

    echo "Setup POST response status: " . $postRes->getStatusCode() . "\n";
    echo "Redirect target: " . $postRes->headers->get('Location') . "\n";

    $newSuper = User::where('username', 'first_super_unique_99')->first();
    if (!$newSuper) {
        throw new Exception("FAIL: First Super Admin user was not created!");
    }
    echo "Created user role: " . $newSuper->role . "\n";
    echo "Created user workspace_id: " . $newSuper->workspace_id . "\n";
    echo "Workspace owner_id: " . $newSuper->workspace->owner_id . "\n";

    if ($newSuper->role !== 'super_admin' || empty($newSuper->workspace_id) || $newSuper->workspace->owner_id !== $newSuper->id) {
        throw new Exception("FAIL: Workspace ownership mismatch!");
    }
    echo "✓ First Super Admin created with isolated workspace owned by this Super Admin\n";

    // -------------------------------------------------------------
    // SCENARIO B: Super Admin already exists
    // -------------------------------------------------------------
    echo "\n--- SCENARIO B: Super Admin Already Exists ---\n";
    Auth::logout();
    
    // Check Login page response now that a super admin exists
    $reqB = Request::create('/login', 'GET');
    $resB = $kernel->handle($reqB);
    preg_match('/data-page="([^"]+)"/', $resB->getContent(), $matchesB);
    $loginPageDataB = json_decode(htmlspecialchars_decode($matchesB[1]), true);

    echo "needsSuperAdminSetup prop: " . var_export($loginPageDataB['props']['needsSuperAdminSetup'], true) . "\n";
    if ($loginPageDataB['props']['needsSuperAdminSetup'] !== false) {
        throw new Exception("FAIL: needsSuperAdminSetup was expected to be false when a super admin exists!");
    }
    echo "✓ Login page correctly hides setup link (needsSuperAdminSetup = false)\n";

    // Attempt to access setup GET route
    $setupReqB = Request::create('/setup/super-admin', 'GET');
    $setupResB = $kernel->handle($setupReqB);
    echo "Setup GET route status when super admin exists: " . $setupResB->getStatusCode() . "\n";
    echo "Redirected to: " . $setupResB->headers->get('Location') . "\n";
    if ($setupResB->getStatusCode() !== 302 || !str_contains($setupResB->headers->get('Location'), '/login')) {
        throw new Exception("FAIL: Setup GET route did not redirect to /login!");
    }
    echo "✓ Setup GET route blocked and redirected to /login\n";

    // Attempt to post to setup route to create a second arbitrary super admin
    $postReqB = Request::create('/setup/super-admin', 'POST', [
        'name' => 'Second Super Admin Attempt',
        'username' => 'second_super_99',
        'email' => 'second_super_99@feedchain.test',
        'password' => 'SuperPassword123!',
        'password_confirmation' => 'SuperPassword123!',
    ]);
    $sessionStoreB = $app['session']->driver();
    $sessionStoreB->setId('test_session_scenario_b');
    $sessionStoreB->start();
    $postReqB->setLaravelSession($sessionStoreB);
    $postReqB->headers->set('X-CSRF-TOKEN', $sessionStoreB->token());
    $postResB = $kernel->handle($postReqB);
    echo "Setup POST status when super admin exists: " . $postResB->getStatusCode() . "\n";
    if ($postResB->getStatusCode() !== 403) {
        throw new Exception("FAIL: Setup POST did not return 403 Forbidden!");
    }
    echo "✓ Setup POST route blocked (403 Forbidden)\n";

    // -------------------------------------------------------------
    // SCENARIO C: Existing Super Admin logs in
    // -------------------------------------------------------------
    echo "\n--- SCENARIO C: Super Admin Login & Dashboard ---\n";
    $loginPostReq = Request::create('/login', 'POST', [
        'email' => 'first_super_unique_99@feedchain.test',
        'password' => 'SuperPassword123!',
    ]);
    $loginSession = $app['session']->driver();
    $loginSession->setId('test_session_scenario_c');
    $loginSession->start();
    $loginPostReq->setLaravelSession($loginSession);
    $loginPostReq->headers->set('X-CSRF-TOKEN', $loginSession->token());
    $loginPostRes = $kernel->handle($loginPostReq);

    echo "Login POST status: " . $loginPostRes->getStatusCode() . "\n";
    echo "Login redirect target: " . $loginPostRes->headers->get('Location') . "\n";
    if (!str_contains($loginPostRes->headers->get('Location'), 'dashboard/super-admin')) {
        throw new Exception("FAIL: Super Admin was not redirected to super admin dashboard!");
    }
    echo "✓ Super Admin successfully authenticates and redirects to dashboard.super_admin\n";

    // -------------------------------------------------------------
    // SCENARIO D: Workspace Isolation Between Two Super Admins
    // -------------------------------------------------------------
    echo "\n--- SCENARIO D: Two Super Admins / Workspaces Isolation ---\n";
    // Create second super admin and workspace
    $workspace2 = Workspace::create(['name' => 'Second Super Workspace']);
    $super2 = User::create([
        'name' => 'Second Super',
        'username' => 'second_super_real_99',
        'email' => 'second_super_real_99@feedchain.test',
        'password' => Hash::make('password'),
        'role' => 'super_admin',
        'status' => 'active',
        'workspace_id' => $workspace2->id,
    ]);
    $workspace2->update(['owner_id' => $super2->id]);

    // Create raw material in workspace 1
    Auth::login($newSuper);
    $rm1 = RawMaterial::create([
        'material_code' => 'RM-WS1',
        'name' => 'Workspace 1 Material',
        'material_name' => 'Workspace 1 Material',
        'material_type' => 'Additives',
        'category' => 'Additives',
        'quantity' => 100,
        'unit_cost' => 20,
        'unit' => 'kg',
        'quantity_on_hand' => 100,
        'reorder_level' => 10,
        'cost_per_unit' => 20,
        'status' => 'active',
    ]);
    $rm1Workspace = $rm1->workspace_id;
    echo "Created material in workspace: " . $rm1Workspace . "\n";

    // Switch to Super Admin 2
    Auth::login($super2);
    $visibleMaterials = RawMaterial::pluck('material_code')->toArray();
    echo "Materials visible to Super Admin 2: " . json_encode($visibleMaterials) . "\n";

    if (in_array('RM-WS1', $visibleMaterials)) {
        throw new Exception("FAIL: Super Admin 2 can see materials from Super Admin 1's workspace!");
    }
    echo "✓ Super Admin 2 cannot see records from Super Admin 1's workspace\n";
    echo "✓ Workspace isolation verified\n";

} finally {
    // ALWAYS rollback so development database is pristine!
    DB::rollBack();
    echo "\n[TRANSACTION ROLLED BACK - Database remains untouched]\n";
}

echo "\nALL SCENARIOS VERIFIED SUCCESSFULLY!\n";
