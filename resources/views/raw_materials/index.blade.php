@extends('layouts.admin')

@section('title', 'Raw Materials')
@section('page_title', 'Raw Materials')
@section('page_subtitle', 'Manage raw material inventory and reorder levels')

@section('content')
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <form method="GET" class="flex flex-wrap gap-2">
        <input type="text" name="q" value="{{ request('q') }}" placeholder="Search materials..." class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <label class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <input type="checkbox" name="low_stock" value="1" @checked(request('low_stock'))>
            Low stock only
        </label>
        <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">Filter</button>
    </form>
    <a href="{{ route('raw_materials.create') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Add Raw Material</a>
</div>

<div class="overflow-hidden rounded-xl bg-white shadow-sm">
    <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-slate-600">
            <tr>
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Type</th>
                <th class="px-4 py-3">Stock</th>
                <th class="px-4 py-3">Reorder Level</th>
                <th class="px-4 py-3">Cost/Unit</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($materials as $material)
                <tr class="border-t border-slate-100 {{ $material->quantity_on_hand <= $material->reorder_level ? 'bg-amber-50' : '' }}">
                    <td class="px-4 py-3 font-medium">{{ $material->material_code }}</td>
                    <td class="px-4 py-3">{{ $material->material_name }}</td>
                    <td class="px-4 py-3">{{ $material->material_type }}</td>
                    <td class="px-4 py-3">{{ number_format($material->quantity_on_hand, 2) }} {{ $material->unit }}</td>
                    <td class="px-4 py-3">{{ number_format($material->reorder_level, 2) }}</td>
                    <td class="px-4 py-3">₱{{ number_format($material->cost_per_unit, 2) }}</td>
                    <td class="px-4 py-3">{{ ucfirst($material->status) }}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <a href="{{ route('raw_materials.show', $material) }}" class="text-blue-600 hover:underline">View</a>
                            <a href="{{ route('raw_materials.edit', $material) }}" class="text-amber-600 hover:underline">Edit</a>
                            <form action="{{ route('raw_materials.destroy', $material) }}" method="POST" onsubmit="return confirm('Delete this material?')">
                                @csrf @method('DELETE')
                                <button class="text-red-600 hover:underline">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
            @empty
                <tr><td colspan="8" class="px-4 py-8 text-center text-slate-500">No raw materials found.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="mt-4">{{ $materials->withQueryString()->links() }}</div>
@endsection
