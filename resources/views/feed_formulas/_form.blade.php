@php($formula = $formula ?? null)
@php($existingItems = old('items', isset($formula) ? $formula->items->map(fn ($item) => [
    'raw_material_id' => $item->raw_material_id,
    'quantity_required' => $item->quantity_required,
    'unit' => $item->unit,
])->toArray() : [['raw_material_id' => '', 'quantity_required' => '', 'unit' => 'kg']]))

<div class="grid gap-4 md:grid-cols-2">
    <div>
        <label class="mb-1 block text-sm font-medium">Formula Code</label>
        <input type="text" name="formula_code" value="{{ old('formula_code', $formula->formula_code ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Formula Name</label>
        <input type="text" name="formula_name" value="{{ old('formula_name', $formula->formula_name ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Feed Product</label>
        <select name="feed_product_id" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="">Select product</option>
            @foreach($products as $product)
                <option value="{{ $product->id }}" @selected(old('feed_product_id', $formula->feed_product_id ?? '') == $product->id)>
                    {{ $product->product_code }} — {{ $product->product_name }}
                </option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Batch Size (kg)</label>
        <input type="number" step="0.001" name="batch_size_kg" value="{{ old('batch_size_kg', $formula->batch_size_kg ?? 1000) }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select name="status" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="active" @selected(old('status', $formula->status ?? 'active') === 'active')>Active</option>
            <option value="inactive" @selected(old('status', $formula->status ?? 'active') === 'inactive')>Inactive</option>
        </select>
    </div>
</div>

<div class="mt-6">
    <div class="mb-3 flex items-center justify-between">
        <h3 class="font-semibold">Formula Items (Raw Materials)</h3>
        <button type="button" id="add-item-row" class="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white">Add Item</button>
    </div>
    <div id="formula-items" class="space-y-3">
        @foreach($existingItems as $index => $item)
            <div class="formula-item-row grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-4">
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm font-medium">Raw Material</label>
                    <select name="items[{{ $index }}][raw_material_id]" class="w-full rounded-lg border border-slate-300 px-3 py-2">
                        <option value="">Select material</option>
                        @foreach($materials as $material)
                            <option value="{{ $material->id }}" @selected(($item['raw_material_id'] ?? '') == $material->id)>
                                {{ $material->material_code }} — {{ $material->material_name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="mb-1 block text-sm font-medium">Quantity Required</label>
                    <input type="number" step="0.001" name="items[{{ $index }}][quantity_required]" value="{{ $item['quantity_required'] ?? '' }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
                </div>
                <div class="flex items-end gap-2">
                    <div class="flex-1">
                        <label class="mb-1 block text-sm font-medium">Unit</label>
                        <input type="text" name="items[{{ $index }}][unit]" value="{{ $item['unit'] ?? 'kg' }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
                    </div>
                    <button type="button" class="remove-item-row rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">Remove</button>
                </div>
            </div>
        @endforeach
    </div>
</div>

<template id="formula-item-template">
    <div class="formula-item-row grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-4">
        <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium">Raw Material</label>
            <select data-name="raw_material_id" class="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Select material</option>
                @foreach($materials as $material)
                    <option value="{{ $material->id }}">{{ $material->material_code }} — {{ $material->material_name }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <label class="mb-1 block text-sm font-medium">Quantity Required</label>
            <input type="number" step="0.001" data-name="quantity_required" class="w-full rounded-lg border border-slate-300 px-3 py-2">
        </div>
        <div class="flex items-end gap-2">
            <div class="flex-1">
                <label class="mb-1 block text-sm font-medium">Unit</label>
                <input type="text" data-name="unit" value="kg" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            </div>
            <button type="button" class="remove-item-row rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">Remove</button>
        </div>
    </div>
</template>
