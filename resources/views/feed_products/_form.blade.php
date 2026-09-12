@php($product = $product ?? null)

<div class="grid gap-4 md:grid-cols-2">
    <div>
        <label class="mb-1 block text-sm font-medium">Product Code</label>
        <input type="text" name="product_code" value="{{ old('product_code', $product->product_code ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Product Name</label>
        <input type="text" name="product_name" value="{{ old('product_name', $product->product_name ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Feed Type</label>
        <input type="text" name="feed_type" value="{{ old('feed_type', $product->feed_type ?? '') }}" placeholder="Starter, Grower, Finisher..." class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Unit</label>
        <input type="text" name="unit" value="{{ old('unit', $product->unit ?? 'kg') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Price</label>
        <input type="number" step="0.01" name="price" value="{{ old('price', $product->price ?? 0) }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select name="status" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="active" @selected(old('status', $product->status ?? 'active') === 'active')>Active</option>
            <option value="inactive" @selected(old('status', $product->status ?? 'active') === 'inactive')>Inactive</option>
        </select>
    </div>
    <div class="md:col-span-2">
        <label class="mb-1 block text-sm font-medium">Description</label>
        <textarea name="description" rows="3" class="w-full rounded-lg border border-slate-300 px-3 py-2">{{ old('description', $product->description ?? '') }}</textarea>
    </div>
</div>
