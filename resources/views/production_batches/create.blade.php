@extends('layouts.app')
@section('content')
<div class="container py-4">
    <div class="card shadow-sm border-0">
        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Record Production Batch</h4>
        </div>
        <div class="card-body">
            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('production_batches.store') }}">
                @csrf
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Batch Number</label>
                    <input name="batch_number" class="form-control" value="{{ old('batch_number') }}" placeholder="e.g. BATCH-2026-006" required>
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Feed Product ID</label>
                    <input name="feed_product_id" type="number" class="form-control" value="{{ old('feed_product_id') }}" placeholder="e.g. 3" required>
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Feed Formula ID</label>
                    <input name="feed_formula_id" type="number" class="form-control" value="{{ old('feed_formula_id') }}" placeholder="e.g. 3" required>
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Production Date</label>
                    <input type="date" name="production_date" class="form-control" value="{{ old('production_date', date('Y-m-d')) }}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Quantity (kg)</label>
                    <input name="quantity_kg" type="number" step="0.001" class="form-control" value="{{ old('quantity_kg', 1000) }}">
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Sacks / Bags Produced</label>
                    <input name="sacks_produced" type="number" class="form-control" value="{{ old('sacks_produced', 40) }}" required min="1">
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Status</label>
                    <select name="status" class="form-control" required>
                        <option value="completed" {{ old('status') === 'completed' ? 'selected' : '' }}>Completed (deducts raw materials & adds finished goods)</option>
                        <option value="in_progress" {{ old('status') === 'in_progress' ? 'selected' : '' }}>In Progress</option>
                        <option value="planned" {{ old('status') === 'planned' ? 'selected' : '' }}>Planned</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label font-weight-bold">Notes (Optional)</label>
                    <textarea name="notes" class="form-control" rows="2">{{ old('notes') }}</textarea>
                </div>
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">Save Production Batch</button>
                    <a href="{{ route('production_batches.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
