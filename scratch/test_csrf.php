<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

DB::beginTransaction();
try {
    // 1. Visit /login
    $req1 = Request::create('/login', 'GET');
    $res1 = $kernel->handle($req1);
    
    $session = $app['session']->driver();
    $guestToken = $session->token();
    echo "Guest session ID: " . $session->getId() . "\n";
    echo "Guest CSRF token: " . $guestToken . "\n";

    // Cookies from res1
    $cookies = [];
    foreach ($res1->headers->getCookies() as $c) {
        $cookies[$c->getName()] = $c->getValue();
    }
    echo "XSRF-TOKEN cookie from GET /login: " . substr($cookies['XSRF-TOKEN'] ?? 'none', 0, 30) . "...\n";

    // 2. Post /login with guest session & guest token
    $user = User::first();
    if (!$user) {
        echo "No user in DB\n";
        exit;
    }
    echo "Testing with user: " . $user->email . "\n";

    $reqLogin = Request::create('/login', 'POST', [
        'email' => $user->email,
        'password' => 'password', // might not be correct password, let's login directly
    ], $cookies);
    $reqLogin->setLaravelSession($session);
    $reqLogin->headers->set('X-CSRF-TOKEN', $guestToken);
    
    // Let's manually authenticate and regenerate session as AuthenticatedSessionController does
    Auth::login($user);
    $session->regenerate();
    $authSessionId = $session->getId();
    $authToken = $session->token();
    echo "\nAfter login:\n";
    echo "Auth session ID: " . $authSessionId . "\n";
    echo "Auth CSRF token: " . $authToken . "\n";
    echo "Did token change? " . ($guestToken !== $authToken ? 'YES' : 'NO') . "\n";

    // Simulate sending POST /raw_materials using OLD guest token (what happens currently in browser)
    echo "\n--- Attempt 1: Using OLD guest token in X-CSRF-TOKEN (Current frontend behavior) ---\n";
    $reqOld = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-01',
        'material_name' => 'Test Material',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $reqOld->setLaravelSession($session);
    $reqOld->headers->set('X-CSRF-TOKEN', $guestToken);
    $reqOld->headers->set('Accept', 'application/json');

    $resOld = $kernel->handle($reqOld);
    echo "Status: " . $resOld->getStatusCode() . "\n";
    echo "Response: " . $resOld->getContent() . "\n";

    // Simulate sending POST /raw_materials using NEW auth token in X-CSRF-TOKEN
    echo "\n--- Attempt 2: Using NEW auth token in X-CSRF-TOKEN ---\n";
    $reqNew = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-02',
        'material_name' => 'Test Material 2',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $reqNew->setLaravelSession($session);
    $reqNew->headers->set('X-CSRF-TOKEN', $authToken);
    $reqNew->headers->set('Accept', 'application/json');

    $resNew = $kernel->handle($reqNew);
    echo "Status: " . $resNew->getStatusCode() . "\n";
    echo "Response: " . substr($resNew->getContent(), 0, 100) . "...\n";

    // Cookies from resNew
    $newCookies = [];
    foreach ($resNew->headers->getCookies() as $c) {
        $newCookies[$c->getName()] = $c->getValue();
    }
    echo "\nXSRF-TOKEN cookie in response: " . substr($newCookies['XSRF-TOKEN'] ?? 'none', 0, 30) . "...\n";

    // Attempt 3: Using X-XSRF-TOKEN header with the cookie value
    echo "\n--- Attempt 3: Using X-XSRF-TOKEN header with XSRF-TOKEN cookie ---\n";
    $reqCookie = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-03',
        'material_name' => 'Test Material 3',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $reqCookie->setLaravelSession($session);
    // In browser, document.cookie has the XSRF-TOKEN cookie value
    $reqCookie->headers->set('X-XSRF-TOKEN', $newCookies['XSRF-TOKEN']);
    $reqCookie->headers->set('Accept', 'application/json');

    $resCookie = $kernel->handle($reqCookie);
    echo "Status: " . $resCookie->getStatusCode() . "\n";
    echo "Response: " . substr($resCookie->getContent(), 0, 100) . "...\n";

    // Attempt 4: Using BOTH headers
    echo "\n--- Attempt 4: Using BOTH X-CSRF-TOKEN and X-XSRF-TOKEN ---\n";
    $reqBoth = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-04',
        'material_name' => 'Test Material 4',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $reqBoth->setLaravelSession($session);
    $reqBoth->headers->set('X-CSRF-TOKEN', $authToken);
    $reqBoth->headers->set('X-XSRF-TOKEN', $newCookies['XSRF-TOKEN']);
    $reqBoth->headers->set('Accept', 'application/json');

    $resBoth = $kernel->handle($reqBoth);
    echo "Status: " . $resBoth->getStatusCode() . "\n";
    echo "Response: " . substr($resBoth->getContent(), 0, 100) . "...\n";

    // Attempt 5: Stale X-CSRF-TOKEN + Valid X-XSRF-TOKEN
    echo "\n--- Attempt 5: Stale X-CSRF-TOKEN + Valid X-XSRF-TOKEN ---\n";
    $reqStaleBoth = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-05',
        'material_name' => 'Test Material 5',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $reqStaleBoth->setLaravelSession($session);
    $reqStaleBoth->headers->set('X-CSRF-TOKEN', 'stale_token_value');
    $reqStaleBoth->headers->set('X-XSRF-TOKEN', $newCookies['XSRF-TOKEN']);
    $reqStaleBoth->headers->set('Accept', 'application/json');

    $resStaleBoth = $kernel->handle($reqStaleBoth);
    echo "Status: " . $resStaleBoth->getStatusCode() . "\n";
    echo "Response: " . substr($resStaleBoth->getContent(), 0, 100) . "...\n";

    // Attempt 6: Caller passed stale X-CSRF-TOKEN, but csrfFetch replaces/fixes it
    echo "\n--- Attempt 6: Fixed csrfFetch logic ---\n";
    $reqFixed = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-06',
        'material_name' => 'Test Material 6',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $reqFixed->setLaravelSession($session);
    // Caller originally passed stale token
    $reqFixed->headers->set('X-CSRF-TOKEN', 'stale_token_value');
    
    // csrfFetch logic applied:
    $reqFixed->headers->set('X-CSRF-TOKEN', $authToken);
    $reqFixed->headers->set('X-XSRF-TOKEN', $newCookies['XSRF-TOKEN']);
    $reqFixed->headers->set('Accept', 'application/json');

    $resFixed = $kernel->handle($reqFixed);
    echo "Status: " . $resFixed->getStatusCode() . "\n";
    echo "Response: " . substr($resFixed->getContent(), 0, 100) . "...\n";


    // Attempt 7: Caller passed stale X-CSRF-TOKEN, csrfFetch removes it and sets X-XSRF-TOKEN
    echo "\n--- Attempt 7: Caller passed stale X-CSRF-TOKEN, csrfFetch deletes it and sets X-XSRF-TOKEN ---\n";
    $req7 = Request::create('/raw_materials', 'POST', [
        'material_code' => 'TEST-07',
        'material_name' => 'Test Material 7',
        'material_type' => 'Additives',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 5,
        'cost_per_unit' => 10,
        'status' => 'active',
    ]);
    $req7->setLaravelSession($session);
    // Caller set stale token:
    $req7->headers->set('X-CSRF-TOKEN', 'stale_token_value');
    
    // csrfFetch fixes it:
    $req7->headers->remove('X-CSRF-TOKEN');
    $req7->headers->set('X-XSRF-TOKEN', $newCookies['XSRF-TOKEN']);
    $req7->headers->set('Accept', 'application/json');

    $res7 = $kernel->handle($req7);
    echo "Status: " . $res7->getStatusCode() . "\n";
    echo "Response: " . substr($res7->getContent(), 0, 100) . "...\n";

} finally {
    DB::rollBack();
}
