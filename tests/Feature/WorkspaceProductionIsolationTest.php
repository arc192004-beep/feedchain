<?php

use App\Models\Buyer;
use App\Models\Customer;
use App\Models\FeedFormula;
use App\Models\FeedProduct;
use App\Models\FormulaItem;
use App\Models\RawMaterial;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Hash;

/**
 * A workspace with a Super Admin plus seeded reference data for production
 * tests. Records are created while authenticated so the workspace scope applies.
 */
function makeProductionTenant(string $label): array
{
    $workspace = Workspace::create(['name' => "{$label} Prod"]);

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

    $previous = auth()->user();
    auth()->login($super);

    try {
        $material = RawMaterial::create([
            'material_code' => 'RM-'.$label,
            'material_name' => 'Material '.$label,
            'material_type' => 'Additive',
            'unit' => 'kg',
            'quantity_on_hand' => 1000,
            'reorder_level' => 10,
            'cost_per_unit' => 5,
            'status' => 'active',
        ]);

        $product = FeedProduct::create([
            'product_code' => 'FP-'.$label,
            'product_name' => 'Product '.$label,
            'feed_type' => 'Grower',
            'unit' => 'kg',
            'price' => 100,
            'status' => 'active',
            'quantity_bags' => 500,
            'min_stock_bags' => 5,
            'bag_weight_kg' => 25,
        ]);

        $formula = FeedFormula::create([
            'formula_code' => 'FF-'.$label,
            'formula_name' => 'Formula '.$label,
            'feed_product_id' => $product->id,
            'batch_size_kg' => 1000,
            'status' => 'active',
        ]);

        FormulaItem::create([
            'feed_formula_id' => $formula->id,
            'raw_material_id' => $material->id,
            'quantity_required' => 500,
            'unit' => 'kg',
        ]);

        $buyer = Buyer::create([
            'buyer_code' => 'BUY-'.$label,
            'buyer_name' => 'Buyer '.$label,
            'fishpond_or_cage_name' => 'Cage '.$label,
            'address' => 'Address '.$label,
            'contact_number' => '555',
        ]);

        $customer = Customer::create([
            'name' => 'Customer '.$label,
            'address' => 'Address '.$label,
            'contact_number' => '555',
            'status' => 'active',
        ]);
    } finally {
        $previous ? auth()->login($previous) : auth()->logout();
    }

    return compact('workspace', 'super', 'material', 'product', 'formula', 'buyer', 'customer');
}

beforeEach(function () {
    $this->one = makeProductionTenant('ONE');
    $this->two = makeProductionTenant('TWO');

    // A complete production + distribution + sale in workspace ONE.
    $this->actingAs($this->one['super'])->postJson('/production_batches', [
        'batch_number' => 'BATCH-ONE-1',
        'feed_product_id' => $this->one['product']->id,
        'feed_formula_id' => $this->one['formula']->id,
        'production_date' => '2026-09-19',
        'sacks_produced' => 10,
        'status' => 'completed',
    ])->assertCreated();

    $this->actingAs($this->one['super'])->postJson('/distributions', [
        'buyer_id' => $this->one['buyer']->id,
        'distribution_date' => '2026-09-19',
        'feed_product_id' => $this->one['product']->id,
        'quantity' => 2,
    ])->assertCreated();

    $this->actingAs($this->one['super'])->postJson('/sales', [
        'customer_id' => $this->one['customer']->id,
        'sale_date' => '2026-09-19',
        'items' => [[
            'feed_product_id' => $this->one['product']->id,
            'quantity' => 1,
            'unit_price' => 100,
        ]],
    ])->assertCreated();
});

test('the other workspace sees none of the production pipeline', function () {
    foreach (['/production_batches', '/distributions', '/sales', '/inventory/movements'] as $endpoint) {
        $payload = $this->actingAs($this->two['super'])->getJson($endpoint)->assertOk()->json('data');

        expect($payload)->toBeArray()->and($payload)->toBeEmpty();
    }

    // And workspace ONE does see its own records.
    foreach (['/production_batches', '/distributions', '/sales'] as $endpoint) {
        $payload = $this->actingAs($this->one['super'])->getJson($endpoint)->assertOk()->json('data');

        expect($payload)->toBeArray()->and($payload)->not->toBeEmpty();
    }
});

test('guessing a foreign batch, sale or distribution id is denied', function () {
    $batchId = $this->actingAs($this->one['super'])->getJson('/production_batches')->json('data.0.id');
    $saleId = $this->actingAs($this->one['super'])->getJson('/sales')->json('data.0.id');
    $distId = $this->actingAs($this->one['super'])->getJson('/distributions')->json('data.0.id');

    expect($batchId)->not->toBeNull()->and($saleId)->not->toBeNull()->and($distId)->not->toBeNull();

    $this->actingAs($this->two['super'])->getJson("/production_batches/{$batchId}")->assertNotFound();
    $this->actingAs($this->two['super'])->getJson("/sales/{$saleId}")->assertNotFound();
    $this->actingAs($this->two['super'])->getJson("/distributions/{$distId}")->assertNotFound();

    $this->actingAs($this->two['super'])->deleteJson("/production_batches/{$batchId}")->assertNotFound();
    $this->actingAs($this->two['super'])->deleteJson("/sales/{$saleId}")->assertNotFound();
    $this->actingAs($this->two['super'])->deleteJson("/distributions/{$distId}")->assertNotFound();

    // The records survived the cross-workspace attempts.
    $this->actingAs($this->one['super'])->getJson("/production_batches/{$batchId}")->assertOk();
    $this->actingAs($this->one['super'])->getJson("/sales/{$saleId}")->assertOk();
    $this->actingAs($this->one['super'])->getJson("/distributions/{$distId}")->assertOk();
});

test('inventory movements and labels stay inside the workspace', function () {
    $payload = $this->actingAs($this->one['super'])->getJson('/inventory/movements')->assertOk()->json('data');

    expect($payload)->not->toBeEmpty();

    foreach ($payload as $move) {
        expect($move['workspace_id'])->toBe($this->one['workspace']->id);
    }
});

test('a second workspace can reuse the identical operational codes', function () {
    // The same batch/sales/distribution codes as workspace ONE must be usable here.
    $this->actingAs($this->two['super'])->postJson('/production_batches', [
        'batch_number' => 'BATCH-ONE-1',
        'feed_product_id' => $this->two['product']->id,
        'feed_formula_id' => $this->two['formula']->id,
        'production_date' => '2026-09-19',
        'sacks_produced' => 5,
        'status' => 'completed',
    ])->assertCreated();

    $payload = $this->actingAs($this->two['super'])->getJson('/production_batches')->assertOk()->json('data');

    expect($payload)->toHaveCount(1)
        ->and($payload[0]['batch_number'])->toBe('BATCH-ONE-1')
        ->and($payload[0]['workspace_id'])->toBe($this->two['workspace']->id);
});
