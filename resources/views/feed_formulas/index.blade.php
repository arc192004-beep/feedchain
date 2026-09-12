@extends('layouts.admin')

@section('title', 'Feed Formulas')
@section('page_title', 'Feed Formulas')
@section('page_subtitle', 'Standard feed formulas linked to products and raw materials')

@section('content')
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <form method="GET" class="flex gap-2">
        <input type="text" name="q" value="{{ request('q') }}" placeholder="Search formulas..." class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">Search</button>
    </form>
    <a href="{{ route('feed_formulas.create') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Add Formula</a>
</div>

<div class="overflow-hidden rounded-xl bg-white shadow-sm">
    <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-slate-600">
            <tr>
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Formula Name</th>
                <th class="px-4 py-3">Feed Product</th>
                <th class="px-4 py-3">Batch Size (kg)</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($formulas as $formula)
                <tr class="border-t border-slate-100">
                    <td class="px-4 py-3 font-medium">{{ $formula->formula_code }}</td>
                    <td class="px-4 py-3">{{ $formula->formula_name }}</td>
                    <td class="px-4 py-3">{{ $formula->feedProduct->product_name ?? '—' }}</td>
                    <td class="px-4 py-3">{{ number_format($formula->batch_size_kg, 2) }}</td>
                    <td class="px-4 py-3">{{ ucfirst($formula->status) }}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <a href="{{ route('feed_formulas.show', $formula) }}" class="text-blue-600 hover:underline">View</a>
                            <a href="{{ route('feed_formulas.edit', $formula) }}" class="text-amber-600 hover:underline">Edit</a>
                            <form action="{{ route('feed_formulas.destroy', $formula) }}" method="POST" onsubmit="return confirm('Delete this formula?')">
                                @csrf @method('DELETE')
                                <button class="text-red-600 hover:underline">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
            @empty
                <tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">No feed formulas found.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="mt-4">{{ $formulas->withQueryString()->links() }}</div>
@endsection
