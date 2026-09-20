<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(UsersTableSeeder::class);

        // Business records inherit a workspace from the authenticated user, so
        // the seeded demo data must run inside the default workspace context.
        // Without this the rows would be created with a null workspace and be
        // invisible to every account.
        $workspace = Workspace::where('name', 'Default Workspace')->first();
        $owner = $workspace
            ? User::where('workspace_id', $workspace->id)->where('role', 'super_admin')->first()
            : null;

        if ($owner) {
            Auth::login($owner);
        }

        $this->call([
            RawMaterialsTableSeeder::class,
            FeedProductsTableSeeder::class,
            FeedFormulasTableSeeder::class,
        ]);
    }
}
