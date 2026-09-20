<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class SetupSuperAdminController extends Controller
{
    public function create(): Response|RedirectResponse
    {
        if (User::where('role', 'super_admin')->exists()) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/setup-super-admin');
    }

    public function store(Request $request): RedirectResponse
    {
        if (User::where('role', 'super_admin')->exists()) {
            abort(403, 'A Super Administrator account already exists.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50', 'unique:users,username'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($data) {
            $workspace = Workspace::create([
                'name' => $data['name']."'s Workspace",
            ]);

            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => 'super_admin',
                'status' => 'active',
                'workspace_id' => $workspace->id,
            ]);

            $workspace->update(['owner_id' => $user->id]);

            return $user;
        });

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard.super_admin');
    }
}
