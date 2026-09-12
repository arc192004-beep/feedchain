@extends('layouts.admin')

@section('title', 'Production Dashboard')
@section('page_title', 'Production Manager Dashboard')
@section('page_subtitle', 'Production operations overview')

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
        <p class="text-sm text-slate-500">Feed Formulas</p>
        <p class="mt-2 text-3xl font-bold">{{ $stats['formulas'] }}</p>
    </div>
    <div class="rounded-xl bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Low Stock Items</p>
        <p class="mt-2 text-3xl font-bold text-amber-600">{{ $stats['low_stock'] }}</p>
    </div>
</div>

<div class="mt-6 rounded-xl bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold">Production Modules</h2>
    <div class="mt-4 flex flex-wrap gap-3">
        <a href="{{ route('raw_materials.index') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Raw Materials</a>
        <a href="{{ route('feed_products.index') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Feed Products</a>
        <a href="{{ route('feed_formulas.index') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Feed Formulas</a>
    </div>
</div>
@endsection
