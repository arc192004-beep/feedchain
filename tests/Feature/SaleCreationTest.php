<?php

use App\Models\Customer;
use App\Models\FeedProduct;
use App\Models\Inventory;
use App\Models\User;
use App\Models\Workspace;

test('sale creation stores canonical date and deducts finished-feed stock once', function () {
    $workspace = Workspace::create(['name' => 'Sales Workspace']);
    $user = User::factory()->create([
        'workspace_id' => $workspace->id,
        'role' => 'production_manager',
    ]);

    $this->actingAs($user);

    $customer = Customer::create([
        'name' => 'Coastal Feed Buyer',
        'address' => '12 Harbor Road',
        'contact_number' => '09123456789',
        'status' => 'active',
    ]);

    $product = FeedProduct::create([
        'product_code' => 'FP-SALE-TEST',
        'product_name' => 'Grower Feed',
        'feed_type' => 'Grower',
        'unit' => 'bag',
        'price' => 1250,
        'status' => 'active',
        'quantity_bags' => 20,
        'min_stock_bags' => 2,
        'bag_weight_kg' => 25,
    ]);

    $response = $this->postJson('/sales', [
        'customer_id' => $customer->id,
        'sales_date' => '2026-10-07',
        'items' => [[
            'feed_product_id' => $product->id,
            'quantity' => 3,
            'unit_price' => 1250,
        ]],
    ]);

    $response->assertCreated()
        ->assertJsonPath('sales_date', '2026-10-07')
        ->assertJsonPath('total_amount', 3750)
        ->assertJsonPath('customer_id', $customer->id)
        ->assertJsonPath('feed_product_id', $product->id)
        ->assertJsonPath('quantity', 3)
        ->assertJsonPath('workspace_id', $workspace->id);

    $saleNumber = $response->json('sales_number');

    expect($saleNumber)->toStartWith('SALE-'.$workspace->id.'-');

    $this->assertDatabaseHas('sales', [
        'sales_number' => $saleNumber,
        'customer_id' => $customer->id,
        'feed_product_id' => $product->id,
        'quantity' => 3,
        'sales_date' => '2026-10-07',
        'total_amount' => 3750,
        'workspace_id' => $workspace->id,
        'status' => 'completed',
    ]);

    $this->assertDatabaseHas('sale_items', [
        'sale_id' => $response->json('id'),
        'feed_product_id' => $product->id,
        'quantity' => 3,
        'unit_price' => 1250,
        'subtotal' => 3750,
        'workspace_id' => $workspace->id,
    ]);

    expect((float) $product->fresh()->quantity_bags)->toBe(17.0)
        ->and(Inventory::where('feed_product_id', $product->id)->count())->toBe(1)
        ->and((float) Inventory::where('feed_product_id', $product->id)->value('quantity'))->toBe(-3.0);

    $this->actingAs($user)->getJson('/sales')
        ->assertOk()
        ->assertJsonPath('data.0.sales_number', $saleNumber)
        ->assertJsonPath('data.0.sales_date', '2026-10-07')
        ->assertJsonPath('data.0.total_amount', 3750);
});
