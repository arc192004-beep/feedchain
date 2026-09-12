@extends('layouts.admin')

@section('title', 'Analytics Dashboard')
@section('page_title', 'Administrator Dashboard')
@section('page_subtitle', 'Monitoring and reporting overview')

@section('content')
<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Raw Materials</p>
        <p class="mt-2 text-3xl font-bold">{{ $stats['raw_materials'] }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Feed Products</p>
        <p class="mt-2 text-3xl font-bold">{{ $stats['feed_products'] }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total Raw Stock (kg)</p>
        <p class="mt-2 text-3xl font-bold">{{ number_format($stats['total_stock_kg'], 2) }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Low Stock Alerts</p>
        <p class="mt-2 text-3xl font-bold text-red-600">{{ $stats['low_stock'] }}</p>
    </div>
</div>

<div class="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
    <h2 class="text-lg font-semibold text-blue-900">Reporting Access</h2>
    <p class="mt-2 text-sm text-blue-800">Descriptive analytics and BI dashboards will be expanded in the next development phase.</p>
</div>
@endsection
