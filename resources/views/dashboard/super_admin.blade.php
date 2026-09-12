@extends('layouts.admin')

@section('title', 'Super Admin Dashboard')
@section('page_title', 'Super Administrator Dashboard')
@section('page_subtitle', 'System overview and administration')

@section('content')
<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total Users</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ $stats['users'] }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Raw Materials</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ $stats['raw_materials'] }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Feed Products</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ $stats['feed_products'] }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Feed Formulas</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ $stats['formulas'] }}</p>
    </div>
</div>

<div class="mt-6 grid gap-4 lg:grid-cols-2">
    <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold">Quick Actions</h2>
        <div class="mt-4 flex flex-wrap gap-3">
            <a href="{{ route('users.create') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Add User</a>
            <a href="{{ route('raw_materials.create') }}" class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-900">Add Raw Material</a>
            <a href="{{ route('feed_products.create') }}" class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-900">Add Feed Product</a>
            <a href="{{ route('feed_formulas.create') }}" class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-900">Add Formula</a>
        </div>
    </div>
    <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold">System Access</h2>
        <p class="mt-2 text-sm text-slate-600">You have full access to all modules, user management, and reporting dashboards.</p>
    </div>
</div>
@endsection
