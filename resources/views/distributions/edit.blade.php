@extends('layouts.app')
@section('content')
<h3>Edit Distribution: {{ $distribution->distribution_number }}</h3>
<form method="POST" action="{{ route('distributions.update', $distribution) }}">@csrf @method('PUT')
<div class="mb-3">
    <label>Buyer</label>
    <select name="buyer_id" class="form-select" required>
        <option value="">-- Select Buyer --</option>
        @foreach($buyers as $b)
        <option value="{{ $b->id }}" {{ old('buyer_id', $distribution->buyer_id) == $b->id ? 'selected' : '' }}>
            {{ $b->buyer_name }}
        </option>
        @endforeach
    </select>
    @error('buyer_id')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Distribution Date</label>
    <input type="date" name="distribution_date" class="form-control" value="{{ old('distribution_date', $distribution->distribution_date->format('Y-m-d')) }}" required>
    @error('distribution_date')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Feed Product</label>
    <select name="feed_product_id" class="form-select" required>
        <option value="">-- Select Product --</option>
        @foreach($products as $p)
        <option value="{{ $p->id }}" {{ old('feed_product_id', $distribution->items->first()->feed_product_id ?? null) == $p->id ? 'selected' : '' }}>
            {{ $p->product_name }} ({{ $p->quantity_bags }} bags available)
        </option>
        @endforeach
    </select>
    @error('feed_product_id')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Quantity (bags)</label>
    <input name="quantity" class="form-control" type="number" step="0.001" value="{{ old('quantity', $distribution->total_quantity) }}" required>
    @error('quantity')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Remarks</label>
    <textarea name="remarks" class="form-control">{{ old('remarks', $distribution->remarks) }}</textarea>
    @error('remarks')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="alert alert-warning">
    <strong>Note:</strong> Updating this distribution will reverse all previous inventory changes and apply new ones based on the updated values.
</div>
<div class="d-flex gap-2">
    <button class="btn btn-primary">Update</button>
    <form method="POST" action="{{ route('distributions.destroy', $distribution) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button type="button" class="btn btn-danger" onclick="if(confirm('Are you sure you want to delete this distribution and reverse inventory?')) { this.form.submit(); }">Delete</button>
    </form>
    <a href="{{ route('distributions.index') }}" class="btn btn-secondary">Cancel</a>
</div>
</form>
@endsection
