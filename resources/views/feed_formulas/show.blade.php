@extends('layouts.admin')

@section('title', 'Feed Formula Details')
@section('page_title', 'Feed Formula Details')

@section('content')
<div class="grid gap-6 lg:grid-cols-3">
    <div class="rounded-xl bg-white p-6 shadow-sm lg:col-span-1">
        <dl class="space-y-4">
            <div><dt class="text-sm text-slate-500">Formula Code</dt><dd class="font-medium">{{ $formula->formula_code }}</dd></div>
            <div><dt class="text-sm text-slate-500">Formula Name</dt><dd class="font-medium">{{ $formula->formula_name }}</dd></div>
            <div><dt class="text-sm text-slate-500">Feed Product</dt><dd>{{ $formula->feedProduct->product_name ?? '—' }}</dd></div>
            <div><dt class="text-sm text-slate-500">Batch Size</dt><dd>{{ number_format($formula->batch_size_kg, 2) }} kg</dd></div>
            <div><dt class="text-sm text-slate-500">Status</dt><dd>{{ ucfirst($formula->status) }}</dd></div>
        </dl>
        <div class="mt-6 flex gap-3">
            <a href="{{ route('feed_formulas.edit', $formula) }}" class="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white">Edit</a>
            <a href="{{ route('feed_formulas.index') }}" class="rounded-lg bg-slate-200 px-4 py-2 text-sm">Back</a>
        </div>
    </div>

    <div class="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
        <h3 class="mb-4 text-lg font-semibold">Formula Items</h3>
        <table class="min-w-full text-sm">
            <thead class="bg-slate-50 text-left text-slate-600">
                <tr>
                    <th class="px-3 py-2">Raw Material</th>
                    <th class="px-3 py-2">Quantity Required</th>
                    <th class="px-3 py-2">Unit</th>
                </tr>
            </thead>
            <tbody>
                @forelse($formula->items as $item)
                    <tr class="border-t border-slate-100">
                        <td class="px-3 py-2">{{ $item->rawMaterial->material_name ?? '—' }}</td>
                        <td class="px-3 py-2">{{ number_format($item->quantity_required, 3) }}</td>
                        <td class="px-3 py-2">{{ $item->unit }}</td>
                    </tr>
                @empty
                    <tr><td colspan="3" class="px-3 py-6 text-center text-slate-500">No formula items defined.</td></tr>
                @endforelse
            </tbody>
        </table>
        @php($totalRequired = $formula->items->sum('quantity_required'))
        <p class="mt-4 text-sm text-slate-600">Total required materials: <strong>{{ number_format($totalRequired, 3) }} kg</strong></p>
    </div>
</div>
@endsection
