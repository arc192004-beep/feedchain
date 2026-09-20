<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Hash;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('login page exposes setup flag when no super admin exists', function () {
    $this->get('/login')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/login')
            ->where('needsSuperAdminSetup', true)
        );
});

test('login page hides setup flag when a super admin exists', function () {
    $workspace = Workspace::create(['name' => 'Existing Workspace']);
    $super = User::create([
        'name' => 'Existing Super',
        'username' => 'existingsuper',
        'email' => 'existing-super@example.com',
        'password' => Hash::make('password'),
        'role' => 'super_admin',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);
    $workspace->update(['owner_id' => $super->id]);

    $this->get('/login')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/login')
            ->where('needsSuperAdminSetup', false)
        );
});

test('setup page is available when no super admin exists', function () {
    $this->get(route('setup.super_admin.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/setup-super-admin'));
});

test('initial super admin can be created through setup and receives a workspace', function () {
    $response = $this->post(route('setup.super_admin.store'), [
        'name' => 'First Super',
        'username' => 'firstsuper',
        'email' => 'first-super@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard.super_admin', absolute: false));
    $this->assertAuthenticated();

    $user = User::where('username', 'firstsuper')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe('super_admin')
        ->and($user->workspace_id)->not->toBeNull()
        ->and($user->workspace->owner_id)->toBe($user->id);
});

test('setup cannot create another super admin once one exists', function () {
    $workspace = Workspace::create(['name' => 'Existing Workspace']);
    $super = User::create([
        'name' => 'Existing Super',
        'username' => 'existingsuper',
        'email' => 'existing-super@example.com',
        'password' => Hash::make('password'),
        'role' => 'super_admin',
        'status' => 'active',
        'workspace_id' => $workspace->id,
    ]);
    $workspace->update(['owner_id' => $super->id]);

    $this->get(route('setup.super_admin.create'))
        ->assertRedirect(route('login'));

    $this->post(route('setup.super_admin.store'), [
        'name' => 'Second Super',
        'username' => 'secondsuper',
        'email' => 'second-super@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertForbidden();

    expect(User::where('role', 'super_admin')->count())->toBe(1);
});
