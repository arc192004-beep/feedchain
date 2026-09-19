<?php

use App\Models\Buyer;
use App\Models\Customer;
use App\Models\FeedFormula;
use App\Models\FeedProduct;
use App\Models\FormulaItem;
use App\Models\Inventory;
use App\Models\RawMaterial;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Hash;

/**
 * Build a workspace with a Super Admin plus the other two role accounts.
 *
 * @return array{workspace: Workspace, super: User, admin: User, manager: User}
 */
function makeWorkspaceContext(string $label): array
{
    $workspace = Workspace::create(['name' => "{$label} Workspace"]);

    $super = User::create([
        'name' => "Super Admin {$label}",
        'username' => "super-{$label}",
        'email' => 'super-'.strtolower($label).'@example.com',
        'password' => Hash::make('password'),
        'role' => 'super_admin',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);

    $workspace->update(['owner_id' => $super->id]);

    $admin = User::create([
        'name' => "Administrator {$label}",
        'username' => "admin-{$label}",
        'email' => 'admin-'.strtolower($label).'@example.com',
        'password' => Hash::make('password'),
        'role' => 'administrator',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);

    $manager = User::create([
        'name' => "Manager {$label}",
        'username' => "pm-{$label}",
        'email' => 'pm-'.strtolower($label).'@example.com',
        'password' => Hash::make('password'),
        'role' => 'production_manager',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);

    return compact('workspace', 'super', 'admin', 'manager');
}

/** Create operational records owned by the given user's workspace. */
function createOperationalData(User $owner, string $suffix): array
{
    $previous = auth()->user();
    auth()->login($owner);

    try {
        $material = RawMaterial::create([
            'material_code' => "RM-{$suffix}",
            'material_name' => "Material {$suffix}",
            'material_type' => 'Protein Source',
            'unit' => 'kg',
            'quantity_on_hand' => 100,
            'reorder_level' => 10,
            'cost_per_unit' => 5,
            'status' => 'active',
        ]);

        $product = FeedProduct::create([
            'product_code' => "FP-{$suffix}",
            'product_name' => "Product {$suffix}",
            'feed_type' => 'Grower',
            'unit' => 'kg',
            'price' => 100,
            'status' => 'active',
            'quantity_bags' => 50,
            'min_stock_bags' => 5,
            'bag_weight_kg' => 25,
        ]);

        $formula = FeedFormula::create([
            'formula_code' => "FF-{$suffix}",
            'formula_name' => "Formula {$suffix}",
            'feed_product_id' => $product->id,
            'batch_size_kg' => 1000,
            'status' => 'active',
        ]);

        FormulaItem::create([
            'feed_formula_id' => $formula->id,
            'raw_material_id' => $material->id,
            'quantity_required' => 100,
            'unit' => 'kg',
        ]);

        $buyer = Buyer::create([
            'buyer_code' => "BUY-{$suffix}",
            'buyer_name' => "Buyer {$suffix}",
            'fishpond_or_cage_name' => "Cage {$suffix}",
            'address' => 'Address',
            'contact_number' => '555',
        ]);

        $customer = Customer::create([
            'name' => "Customer {$suffix}",
            'address' => 'Address',
            'contact_number' => '555',
            'status' => 'active',
        ]);

        return compact('material', 'product', 'formula', 'buyer', 'customer');
    } finally {
        $previous ? auth()->login($previous) : auth()->logout();
    }
}

beforeEach(function () {
    $this->a = makeWorkspaceContext('Alpha');
    $this->b = makeWorkspaceContext('Beta');
    $this->dataA = createOperationalData($this->a['manager'], 'A');
    $this->dataB = createOperationalData($this->b['manager'], 'B');
});

test('each super admin registration gets its own workspace', function () {
    $this->post('/register', [
        'name' => 'Alice',
        'username' => 'alice',
        'email' => 'alice@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $alice = User::where('username', 'alice')->first();

    expect($alice)->not->toBeNull()
        ->and($alice->role)->toBe('super_admin')
        ->and($alice->workspace_id)->not->toBeNull()
        ->and($alice->workspace->owner_id)->toBe($alice->id);
});

test('accounts created by a super admin inherit the super admin workspace', function () {
    $this->actingAs($this->a['super'])->post('/users', [
        'name' => 'New Manager A',
        'username' => 'new-manager-a',
        'email' => 'new-manager-a@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'production_manager',
        'status' => 'active',
    ])->assertRedirect(route('users.index'));

    $created = User::where('username', 'new-manager-a')->first();

    expect($created->workspace_id)->toBe($this->a['workspace']->id);
});

test('super admin user listing is limited to their workspace', function () {
    $this->actingAs($this->a['super'])
        ->getJson('/users')
        ->assertOk();

    expect(User::where('workspace_id', $this->a['workspace']->id)->pluck('username'))
        ->toContain('pm-Alpha')
        ->not->toContain('pm-Beta');
});

test('super admin cannot view, edit, update or delete another workspace user', function () {
    $victim = $this->b['manager'];

    $this->actingAs($this->a['super'])->get("/users/{$victim->id}")->assertNotFound();
    $this->actingAs($this->a['super'])->get("/users/{$victim->id}/edit")->assertNotFound();

    $this->actingAs($this->a['super'])->put("/users/{$victim->id}", [
        'name' => 'Hacked',
        'username' => $victim->username,
        'email' => $victim->email,
        'role' => 'production_manager',
        'status' => 'active',
    ])->assertNotFound();

    $this->actingAs($this->a['super'])->delete("/users/{$victim->id}")->assertNotFound();

    expect($victim->fresh()->name)->toBe('Manager Beta');
});

test('list endpoints only return the authenticated workspace records', function () {
    // Endpoints with seeded records must return exactly the workspace's rows.
    $populated = ['/raw_materials', '/feed_products', '/feed_formulas', '/buyers', '/customers'];

    foreach ($populated as $endpoint) {
        $response = $this->actingAs($this->a['manager'])->getJson($endpoint)->assertOk();
        $payload = $response->json('data');

        expect($payload)->toBeArray()->and(count($payload))->toBeGreaterThan(0);

        foreach ($payload as $record) {
            expect($record['workspace_id'])->toBe($this->a['workspace']->id);
        }
    }

    // Endpoints without data must not leak the other workspace's rows.
    foreach (['/sales', '/distributions', '/production_batches'] as $endpoint) {
        $payload = $this->actingAs($this->a['manager'])->getJson($endpoint)->assertOk()->json('data');

        expect($payload)->toBeArray()->and($payload)->toBeEmpty();
    }
});

test('changing an id in the url does not expose another workspace record', function () {
    $foreign = $this->dataB;

    $this->actingAs($this->a['manager'])->get("/raw_materials/{$foreign['material']->id}")->assertNotFound();
    $this->actingAs($this->a['manager'])->get("/feed_products/{$foreign['product']->id}")->assertNotFound();
    $this->actingAs($this->a['manager'])->get("/feed_formulas/{$foreign['formula']->id}")->assertNotFound();
    $this->actingAs($this->a['manager'])->get("/buyers/{$foreign['buyer']->id}")->assertNotFound();
    $this->actingAs($this->a['manager'])->get("/customers/{$foreign['customer']->id}")->assertNotFound();

    $this->actingAs($this->a['manager'])->delete("/raw_materials/{$foreign['material']->id}")->assertNotFound();
    $this->actingAs($this->a['manager'])->put("/customers/{$foreign['customer']->id}", [
        'name' => 'Hacked',
        'address' => 'x',
        'contact_number' => '1',
    ])->assertNotFound();

    expect($foreign['material']->fresh())->not->toBeNull()
        ->and($foreign['customer']->fresh()->name)->toBe('Customer B');
});

test('a workspace cannot reference another workspace records when creating data', function () {
    $foreign = $this->dataB;

    $this->actingAs($this->a['manager'])->post('/feed_formulas', [
        'formula_code' => 'FF-X',
        'formula_name' => 'Cross Workspace',
        'feed_product_id' => $foreign['product']->id,
        'status' => 'active',
        'items' => [[
            'raw_material_id' => $foreign['material']->id,
            'quantity_required' => 100,
        ]],
    ])->assertSessionHasErrors(['feed_product_id']);

    $this->actingAs($this->a['manager'])->post('/sales', [
        'customer_id' => $foreign['customer']->id,
        'sale_date' => '2026-09-19',
        'items' => [[
            'feed_product_id' => $foreign['product']->id,
            'quantity' => 1,
            'unit_price' => 100,
        ]],
    ])->assertSessionHasErrors(['customer_id']);

    expect(FeedFormula::withoutGlobalScope('workspace')->where('formula_code', 'FF-X')->exists())->toBeFalse();
});

test('records created by a user are stored in that user workspace', function () {
    $this->actingAs($this->a['manager'])->postJson('/raw_materials', [
        'material_code' => 'RM-NEW-A',
        'material_name' => 'New Material A',
        'material_type' => 'Additive',
        'unit' => 'kg',
        'quantity_on_hand' => 10,
        'reorder_level' => 1,
        'cost_per_unit' => 2,
        'status' => 'active',
    ])->assertCreated();

    $stored = RawMaterial::withoutGlobalScope('workspace')->where('material_code', 'RM-NEW-A')->first();

    expect($stored->workspace_id)->toBe($this->a['workspace']->id);
});

test('super admin dashboard only surfaces the authenticated workspace users', function () {
    $response = $this->actingAs($this->a['super'])->get('/dashboard/super-admin');

    $response->assertOk();

    $users = collect($response->viewData('page')['props']['users'] ?? []);

    expect($users->pluck('username'))->toContain('pm-Alpha')->not->toContain('pm-Beta');
});

test('production, inventory, distribution and sales stay isolated', function () {
    $this->actingAs($this->a['manager'])->postJson('/production_batches', [
        'batch_no' => 'BATCH-A1',
        'feed_product_id' => $this->dataA['product']->id,
        'feed_formula_id' => $this->dataA['formula']->id,
        'production_date' => '2026-09-19',
        'sacks_produced' => 2,
        'status' => 'completed',
    ])->assertCreated();

    $this->actingAs($this->a['manager'])->postJson('/distributions', [
        'buyer_id' => $this->dataA['buyer']->id,
        'distribution_date' => '2026-09-19',
        'feed_product_id' => $this->dataA['product']->id,
        'quantity' => 1,
    ])->assertCreated();

    $this->actingAs($this->a['manager'])->postJson('/sales', [
        'customer_id' => $this->dataA['customer']->id,
        'sale_date' => '2026-09-19',
        'items' => [[
            'feed_product_id' => $this->dataA['product']->id,
            'quantity' => 1,
            'unit_price' => 100,
        ]],
    ])->assertCreated();

    foreach (['/production_batches', '/distributions', '/sales'] as $endpoint) {
        $payload = $this->actingAs($this->b['manager'])->getJson($endpoint)->assertOk()->json('data');

        expect($payload)->toBeArray()->and($payload)->toBeEmpty();
    }

    $bInventories = $this->actingAs($this->b['manager'])->getJson('/inventory')->assertOk()->json();
    $bMaterialNames = collect($bInventories['raw_materials'])->pluck('material_name');

    expect($bMaterialNames)->toContain('Material B')->not->toContain('Material A');

    $bMovements = $this->actingAs($this->b['manager'])->getJson('/inventory/movements')->assertOk()->json('data');
    expect(collect($bMovements)->pluck('workspace_id')->unique()->values()->all())->not->toContain($this->a['workspace']->id);

    $aBatches = $this->actingAs($this->a['manager'])->getJson('/production_batches')->json('data');
    expect(collect($aBatches)->pluck('batch_number'))->toContain('BATCH-A1');

    expect(Inventory::where('workspace_id', $this->b['workspace']->id)->count())->toBe(0)
        ->and(Inventory::where('workspace_id', $this->a['workspace']->id)->count())->toBeGreaterThan(0);
});

test('a workspace cannot create or read another workspace sales and distributions', function () {
    $foreign = $this->dataB;

    $this->actingAs($this->a['manager'])->postJson('/distributions', [
        'buyer_id' => $foreign['buyer']->id,
        'distribution_date' => '2026-09-19',
        'feed_product_id' => $foreign['product']->id,
        'quantity' => 1,
    ])->assertStatus(422);

    $this->actingAs($this->a['manager'])->postJson('/sales', [
        'customer_id' => $foreign['customer']->id,
        'sale_date' => '2026-09-19',
        'items' => [[
            'feed_product_id' => $foreign['product']->id,
            'quantity' => 1,
            'unit_price' => 100,
        ]],
    ])->assertStatus(422);

    // Workspace A has no records, so any id (including B's valid ids) resolves nowhere.
    $this->actingAs($this->a['manager'])->getJson('/sales/'.($this->dataA['customer']->id))->assertNotFound();
    $this->actingAs($this->a['manager'])->getJson('/distributions/'.($this->dataA['buyer']->id))->assertNotFound();
});
