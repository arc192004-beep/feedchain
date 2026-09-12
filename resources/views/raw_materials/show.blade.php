@extends('layouts.admin')

@section('title', 'Raw Material Details')
@section('page_title', 'Raw Material Details')

@section('content')
<div class="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
    <dl class="grid gap-4 md:grid-cols-2">
        <div><dt class="text-sm text-slate-500">Code</dt><dd class="font-medium">{{ $material->material_code }}</dd></div>
        <div><dt class="text-sm text-slate-500">Name</dt><dd class="font-medium">{{ $material->material_name }}</dd></div>
        <div><dt class="text-sm text-slate-500">Type</dt><dd>{{ $material->material_type }}</dd></div>
        <div><dt class="text-sm text-slate-500">Unit</dt><dd>{{ $material->unit }}</dd></div>
        <div><dt class="text-sm text-slate-500">Quantity On Hand</dt><dd>{{ number_format($material->quantity_on_hand, 2) }} {{ $material->unit }}</dd></div>
        <div><dt class="text-sm text-slate-500">Reorder Level</dt><dd>{{ number_format($material->reorder_level, 2) }}</dd></div>
        <div><dt class="text-sm text-slate-500">Cost Per Unit</dt><dd>₱{{ number_format($material->cost_per_unit, 2) }}</dd></div>
        <div><dt class="text-sm text-slate-500">Status</dt><dd>{{ ucfirst($material->status) }}</dd></div>
    </dl>
    @if($material->quantity_on_hand <= $material->reorder_level)
        <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This material is at or below reorder level.
        </div>
    @endif
    <div class="mt-6 flex gap-3">
        <a href="{{ route('raw_materials.edit', $material) }}" class="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white">Edit</a>
        <a href="{{ route('raw_materials.index') }}" class="rounded-lg bg-slate-200 px-4 py-2 text-sm">Back</a>
    </div>
</div>
@endsection
