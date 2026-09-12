@php($material = $material ?? null)

<div class="grid gap-4 md:grid-cols-2">
    <div>
        <label class="mb-1 block text-sm font-medium">Material Code</label>
        <input type="text" name="material_code" value="{{ old('material_code', $material->material_code ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Material Name</label>
        <input type="text" name="material_name" value="{{ old('material_name', $material->material_name ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Material Type</label>
        <input type="text" name="material_type" value="{{ old('material_type', $material->material_type ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Unit</label>
        <input type="text" name="unit" value="{{ old('unit', $material->unit ?? 'kg') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Quantity On Hand</label>
        <input type="number" step="0.001" name="quantity_on_hand" value="{{ old('quantity_on_hand', $material->quantity_on_hand ?? 0) }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Reorder Level</label>
        <input type="number" step="0.001" name="reorder_level" value="{{ old('reorder_level', $material->reorder_level ?? 0) }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Cost Per Unit</label>
        <input type="number" step="0.01" name="cost_per_unit" value="{{ old('cost_per_unit', $material->cost_per_unit ?? 0) }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select name="status" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="active" @selected(old('status', $material->status ?? 'active') === 'active')>Active</option>
            <option value="inactive" @selected(old('status', $material->status ?? 'active') === 'inactive')>Inactive</option>
        </select>
    </div>
</div>
