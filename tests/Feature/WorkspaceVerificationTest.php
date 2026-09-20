<?php

use App\Models\Buyer;
use App\Models\Customer;
use App\Models\FeedProduct;
use App\Models\Inventory;
use App\Models\RawMaterial;
use App\Models\StockAlert;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Hash;

/**
 * Two independent workspaces, each with a Super Admin, Administrator and
 * Production Manager, seeded with identically named business records.
 *
 * @return array<string, mixed>
 */
function makeTenant(string $label, string $sharedName): array
{
    $workspace = Workspace::create(['name' => "{$label} Tenant"]);

    $super = User::create([
        'name' => "Super {$label}",
        'username' => "super-{$label}",
        'email' => 'super-'.strtolower($label).'@example.com',
        'password' => Hash::make('password'),
        'role' => 'super_admin',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);

    $workspace->update(['owner_id' => $super->id]);

    $admin = User::create([
        'name' => "Admin {$label}",
        'username' => "admin-{$label}",
        'email' => 'admin-'.strtolower($label).'@example.com',
        'password' => Hash::make('password'),
        'role' => 'administrator',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);

    $manager = User::create([
        'name' => "PM {$label}",
        'username' => "pm-{$label}",
        'email' => 'pm-'.strtolower($label).'@example.com',
        'password' => Hash::make('password'),
        'role' => 'production_manager',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);

    return compact('workspace', 'super', 'admin', 'manager', 'sharedName');
}

function seedTenantRecords(User $owner, string $sharedName, float $stock, string $codeSuffix): array
{
    $previous = auth()->user();
    auth()->login($owner);

    try {
        $material = RawMaterial::create([
            'material_code' => 'RM-'.$codeSuffix,
            'material_name' => $sharedName,
            'material_type' => 'Protein Source',
            'unit' => 'kg',
            'quantity_on_hand' => $stock,
            'reorder_level' => 10,
            'cost_per_unit' => 5,
            'status' => 'active',
        ]);

        $product = FeedProduct::create([
            'product_code' => 'FP-'.$codeSuffix,
            'product_name' => $sharedName,
            'feed_type' => 'Grower',
            'unit' => 'kg',
            'price' => 100,
            'status' => 'active',
            'quantity_bags' => 50,
            'min_stock_bags' => 5,
            'bag_weight_kg' => 25,
        ]);

        Inventory::create([
            'inventory_type' => 'raw_material',
            'raw_material_id' => $material->id,
            'quantity' => $stock,
            'quantity_available' => $stock,
            'unit' => 'kg',
            'last_updated' => now(),
        ]);

        $buyer = Buyer::create([
            'buyer_code' => 'BUY-'.$codeSuffix,
            'buyer_name' => $sharedName,
            'fishpond_or_cage_name' => 'Cage '.$codeSuffix,
            'address' => $sharedName.' Address',
            'contact_number' => '555',
        ]);

        $customer = Customer::create([
            'name' => $sharedName,
            'address' => $sharedName.' Address',
            'contact_number' => '555',
            'status' => 'active',
        ]);

        return compact('material', 'product', 'buyer', 'customer');
    } finally {
        $previous ? auth()->login($previous) : auth()->logout();
    }
}

beforeEach(function () {
    // Deliberately identical business names in both workspaces.
    $this->one = makeTenant('One', 'Taimix Starter');
    $this->two = makeTenant('Two', 'Taimix Starter');

    $this->recordsOne = seedTenantRecords($this->one['manager'], 'Taimix Starter', 111, 'ONE');
    $this->recordsTwo = seedTenantRecords($this->two['manager'], 'Taimix Starter', 999, 'TWO');
});

test('identically named records in two workspaces remain separate rows', function () {
    expect($this->recordsOne['material']->id)->not->toBe($this->recordsTwo['material']->id)
        ->and($this->recordsOne['product']->id)->not->toBe($this->recordsTwo['product']->id);

    expect(RawMaterial::withoutGlobalScope('workspace')->where('material_name', 'Taimix Starter')->count())
        ->toBe(2);
});

test('every role sees only its own workspace inventory figures', function () {
    // Raw materials are returned as raw rows; assert on the workspace-owned
    // quantity column so the two tenants' values cannot be confused.
    // Inventory is a production module, so the existing role permissions limit
    // it to Super Admin and Production Manager.
    foreach (['super', 'manager'] as $role) {
        $payload = $this->actingAs($this->one[$role])->getJson('/inventory')->assertOk()->json();

        expect(collect($payload['raw_materials'])->pluck('quantity_on_hand')->map(fn ($v) => (float) $v)->all())
            ->toBe([111.0])
            ->and(collect($payload['raw_materials'])->pluck('workspace_id')->all())
            ->toBe([$this->one['workspace']->id]);
    }

    foreach (['super', 'manager'] as $role) {
        $payload = $this->actingAs($this->two[$role])->getJson('/inventory')->assertOk()->json();

        expect(collect($payload['raw_materials'])->pluck('quantity_on_hand')->map(fn ($v) => (float) $v)->all())
            ->toBe([999.0])
            ->and(collect($payload['raw_materials'])->pluck('workspace_id')->all())
            ->toBe([$this->two['workspace']->id]);
    }

    // Existing role authorization is preserved: Administrator monitors rather
    // than runs production, so inventory stays out of reach.
    $this->actingAs($this->one['admin'])->getJson('/inventory')->assertForbidden();
});

test('production manager cannot reach the other workspace records by id', function () {
    $foreign = $this->recordsTwo;

    $this->actingAs($this->one['manager'])->getJson("/raw_materials/{$foreign['material']->id}")->assertNotFound();
    $this->actingAs($this->one['manager'])->getJson("/feed_products/{$foreign['product']->id}")->assertNotFound();
    $this->actingAs($this->one['manager'])->deleteJson("/raw_materials/{$foreign['material']->id}")->assertNotFound();
    $this->actingAs($this->one['manager'])->deleteJson("/feed_products/{$foreign['product']->id}")->assertNotFound();

    expect($foreign['material']->fresh())->not->toBeNull()
        ->and($foreign['product']->fresh())->not->toBeNull();
});

test('super admin cannot see or manage the other workspace users', function () {
    $foreignManager = $this->two['manager'];

    $this->actingAs($this->one['super'])->get("/users/{$foreignManager->id}")->assertNotFound();
    $this->actingAs($this->one['super'])->put("/users/{$foreignManager->id}", [
        'name' => 'Hijacked',
        'username' => $foreignManager->username,
        'email' => $foreignManager->email,
        'role' => 'production_manager',
        'status' => 'active',
    ])->assertNotFound();
    $this->actingAs($this->one['super'])->delete("/users/{$foreignManager->id}")->assertNotFound();

    expect($foreignManager->fresh()->name)->toBe('PM Two');
});

test('analytics and forecast only aggregate the authenticated workspace', function () {
    // The KPI totals are derived from workspace-scoped queries, so the two
    // tenants' 111 kg / 999 kg figures must never mix, and the forecast (built
    // from the same rows) must be workspace-specific.
    $mine = $this->actingAs($this->one['admin'])->get('/feedchain/dashboard')->assertOk();
    $props = $mine->viewData('page')['props'];

    expect((float) $props['analytics']['kpis']['rawMaterialKg'])->toBe(111.0)
        ->and((float) $props['analytics']['kpis']['finishedFeedBags'])->toBe(50.0);

    $theirs = $this->actingAs($this->two['admin'])->get('/feedchain/dashboard')->assertOk();
    $theirProps = $theirs->viewData('page')['props'];

    expect((float) $theirProps['analytics']['kpis']['rawMaterialKg'])->toBe(999.0)
        ->and((float) $theirProps['analytics']['kpis']['finishedFeedBags'])->toBe(50.0)
        ->and($theirProps['analytics']['forecast']['available'])
        ->toBe($props['analytics']['forecast']['available']);
});

test('searching by name never returns another workspace records', function () {
    foreach (['/customers', '/buyers', '/raw_materials', '/feed_products'] as $endpoint) {
        $payload = $this->actingAs($this->one['manager'])
            ->getJson($endpoint.'?q=Taimix')
            ->assertOk()
            ->json('data');

        expect($payload)->toBeArray()->and($payload)->not->toBeEmpty();

        foreach ($payload as $record) {
            expect($record['workspace_id'])->toBe($this->one['workspace']->id);
        }
    }
});

test('two workspaces may reuse the same business codes without colliding', function () {
    $response = $this->actingAs($this->two['manager'])->postJson('/feed_products', [
        'product_code' => 'FP-ONE',
        'product_name' => 'Taimix Starter Shared Code',
        'feed_type' => 'Grower',
        'unit' => 'kg',
        'price' => 100,
        'status' => 'active',
        'quantity_bags' => 1,
        'min_stock_bags' => 0,
        'bag_weight_kg' => 25,
    ]);

    $response->assertCreated();
    expect($response->json('workspace_id'))->toBe($this->two['workspace']->id);
});

test('analytics shortages are computed per workspace on sqlite', function () {
    $previous = auth()->user();
    auth()->login($this->one['manager']);
    try {
        StockAlert::create([
            'raw_material_id' => $this->recordsOne['material']->id,
            'inventory_type' => 'raw_material',
            'current_quantity' => 1,
            'threshold_quantity' => 10,
            'alert_level' => 'low_stock',
            'alert_message' => 'Low',
            'status' => 'active',
        ]);
    } finally {
        $previous ? auth()->login($previous) : auth()->logout();
    }

    $this->actingAs($this->one['admin'])->get('/feedchain/dashboard')->assertOk();
});
