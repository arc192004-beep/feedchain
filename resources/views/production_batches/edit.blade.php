@extends('layouts.app')
@section('content')
<h3>Edit Production Batch</h3>
<form method="POST" action="{{ route('production_batches.update', $batch) }}">@csrf @method('PUT')
<div class="mb-3">
    <label>Batch Number</label>
    <input name="batch_number" class="form-control" value="{{ old('batch_number', $batch->batch_number) }}" required>
    @error('batch_number')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Feed Product</label>
    <input name="feed_product_id" class="form-control" type="number" value="{{ old('feed_product_id', $batch->feed_product_id) }}" required>
    @error('feed_product_id')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Feed Formula</label>
    <input name="feed_formula_id" class="form-control" type="number" value="{{ old('feed_formula_id', $batch->feed_formula_id) }}" required>
    @error('feed_formula_id')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Batch Setting (optional)</label>
    <input name="batch_setting_id" class="form-control" type="number" value="{{ old('batch_setting_id', $batch->batch_setting_id) }}">
</div>
<div class="mb-3">
    <label>Production Date</label>
    <input type="date" name="production_date" class="form-control" value="{{ old('production_date', $batch->production_date->format('Y-m-d')) }}" required>
    @error('production_date')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Quantity (kg)</label>
    <input name="quantity_kg" class="form-control" type="number" step="0.001" value="{{ old('quantity_kg', $batch->quantity_kg) }}" required>
    @error('quantity_kg')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Sacks Produced</label>
    <input name="sacks_produced" class="form-control" type="number" value="{{ old('sacks_produced', $batch->sacks_produced ?? 0) }}">
    @error('sacks_produced')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="alert alert-warning">
    <strong>Note:</strong> Updating this batch will reverse all previous inventory changes and apply new ones based on the updated values.
</div>
<div class="d-flex gap-2">
    <button class="btn btn-primary">Update</button>
    <form method="POST" action="{{ route('production_batches.destroy', $batch) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button type="button" class="btn btn-danger" onclick="if(confirm('Are you sure you want to delete this batch and reverse all inventory changes?')) { this.form.submit(); }">Delete</button>
    </form>
    <a href="{{ route('production_batches.index') }}" class="btn btn-secondary">Cancel</a>
</div>
</form>
@endsection
