<?php

use App\Models\Customer;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->workspace = Workspace::create(['name' => 'Acme Feeds']);
    $this->user = User::factory()->create([
        'workspace_id' => $this->workspace->id,
        'role' => 'production_manager',
    ]);
});

test('customer can be created with canonical name field', function () {
    $this->actingAs($this->user);

    $customer = Customer::create([
        'name' => 'Ocean Harvest Co',
        'fish_cage' => 'Cage A1',
        'address' => '123 Coastal Road',
        'contact_number' => '09123456789',
        'email' => 'ocean@harvest.example',
        'status' => 'active',
    ]);

    expect($customer)->not->toBeNull()
        ->and($customer->name)->toBe('Ocean Harvest Co')
        ->and($customer->customer_code)->toStartWith('CUST-'.$this->workspace->id.'-')
        ->and($customer->workspace_id)->toBe($this->workspace->id);

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'name' => 'Ocean Harvest Co',
        'customer_code' => $customer->customer_code,
        'workspace_id' => $this->workspace->id,
    ]);
});

test('customer model accessor and mutator bridge customer_name to name', function () {
    $this->actingAs($this->user);

    $customer = new Customer([
        'customer_name' => 'Legacy Name Test',
        'address' => '456 Shoreline St',
        'contact_number' => '09876543210',
        'status' => 'active',
    ]);
    $customer->save();

    expect($customer->name)->toBe('Legacy Name Test')
        ->and($customer->customer_name)->toBe('Legacy Name Test');

    $this->assertDatabaseHas('customers', [
        'id' => $customer->id,
        'name' => 'Legacy Name Test',
    ]);
});

test('customer controller store saves customer via JSON api and web form', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/customers', [
        'name' => 'Aqua Blue Farms',
        'fish_cage' => 'Cage B2',
        'address' => '789 Marine Blvd',
        'contact_number' => '09223334444',
        'email' => 'aquablue@example.com',
        'status' => 'active',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'name' => 'Aqua Blue Farms',
            'workspace_id' => $this->workspace->id,
        ]);

    $created = Customer::where('name', 'Aqua Blue Farms')->first();
    expect($created)->not->toBeNull()
        ->and($created->customer_code)->toStartWith('CUST-'.$this->workspace->id.'-');
});

test('customer controller accepts legacy customer_name parameter and maps to name', function () {
    $this->actingAs($this->user);

    $response = $this->post('/customers', [
        'customer_name' => 'Legacy Input Farm',
        'address' => '101 Bay View Ave',
        'contact_number' => '09334445555',
        'status' => 'active',
    ]);

    $response->assertRedirect(route('customers.index'));

    $this->assertDatabaseHas('customers', [
        'name' => 'Legacy Input Farm',
        'workspace_id' => $this->workspace->id,
    ]);
});

test('customer index list renders successfully with workspace customer', function () {
    $this->actingAs($this->user);

    $customer = Customer::create([
        'name' => 'Listing Test Farm',
        'address' => '321 Harbor Way',
        'contact_number' => '09445556666',
        'status' => 'active',
    ]);

    $response = $this->get('/customers');
    $response->assertOk()
        ->assertSee('Listing Test Farm')
        ->assertSee($customer->customer_code);
});
