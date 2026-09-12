@php
    $role = auth()->user()->role;
    $canManageUsers = $role === 'super_admin';
    $canManageProduction = in_array($role, ['super_admin', 'production_manager']);
    $canViewAnalytics = in_array($role, ['super_admin', 'administrator']);

    $linkClass = function (array $patterns) {
        $active = collect($patterns)->contains(fn ($p) => request()->routeIs($p));
        return $active
            ? 'block rounded-lg bg-blue-600 px-3 py-2 text-sm text-white'
            : 'block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white';
    };
@endphp

<aside class="w-64 shrink-0 bg-slate-900 text-white">
    <div class="border-b border-slate-800 px-5 py-6">
        <p class="text-lg font-bold tracking-wide">FEEDCHAIN</p>
        <p class="text-xs text-slate-400">Aquatic Feeds Management</p>
    </div>

    <nav class="space-y-1 px-3 py-4 text-sm">
        <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Main</p>
        <a href="{{ route('feedchain.dashboard') }}" class="{{ $linkClass(['feedchain.dashboard', 'dashboard.*']) }}">Dashboard</a>

        @if($canManageUsers)
            <p class="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Administration</p>
            <a href="{{ route('users.index') }}" class="{{ $linkClass(['users.*']) }}">User Management</a>
        @endif

        @if($canManageProduction)
            <p class="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Production</p>
            <a href="{{ route('raw_materials.index') }}" class="{{ $linkClass(['raw_materials.*']) }}">Raw Materials</a>
            <a href="{{ route('feed_products.index') }}" class="{{ $linkClass(['feed_products.*']) }}">Feed Products</a>
            <a href="{{ route('feed_formulas.index') }}" class="{{ $linkClass(['feed_formulas.*']) }}">Feed Formulas</a>
        @endif

        @if($canViewAnalytics)
            <p class="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Analytics</p>
            <a href="{{ route('dashboard.analytics') }}" class="{{ $linkClass(['dashboard.analytics']) }}">Reporting Dashboard</a>
        @endif

        <div class="border-t border-slate-800 pt-4">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                    Logout
                </button>
            </form>
        </div>
    </nav>
</aside>
