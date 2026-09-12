<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $this->recordActivity($request->user()->id, 'login', 'Signed in from ' . $request->ip());

        $redirect = $request->user()->role === 'super_admin'
            ? route('dashboard.super_admin', absolute: false)
            : route('feedchain.dashboard', absolute: false);

        return redirect()->intended($redirect);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if ($request->user()) {
            $this->recordActivity($request->user()->id, 'logout', 'Signed out from ' . $request->ip());
        }
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function recordActivity(int $userId, string $action, string $description): void
    {
        try {
            ActivityLog::create(['user_id' => $userId, 'action' => $action, 'module' => 'authentication', 'description' => $description]);
        } catch (\Throwable) {
            // Authentication must remain available if audit storage is unavailable.
        }
    }
}
