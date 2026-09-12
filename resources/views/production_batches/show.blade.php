@extends('layouts.app')
@section('content')
<h3>Batch {{ $batch->batch_no }}</h3>
<div class="alert alert-info">
    <p><strong>Batch Number:</strong> {{ $batch->batch_no }}</p>
    <p><strong>Product:</strong> {{ $batch->feedProduct->feed_name }}</p>
    <p><strong>Date:</strong> {{ $batch->production_date->format('Y-m-d') }}</p>
    <p><strong>Quantity (kg):</strong> {{ $batch->quantity_kg }}</p>
    <p><strong>Sacks Produced:</strong> {{ $batch->sacks_produced ?? 'N/A' }}</p>
</div>

<h4>Material Usages</h4>
<table class="table">
    <thead>
        <tr>
            <th>Material</th>
            <th>Quantity</th>
            <th>Unit</th>
        </tr>
    </thead>
    <tbody>
        @foreach($batch->materials as $m)
        <tr>
            <td>{{ $m->rawMaterial->material_name }}</td>
            <td>{{ $m->quantity_used }}</td>
            <td>{{ $m->unit ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="d-flex gap-2">
    <a href="{{ route('production_batches.edit', $batch) }}" class="btn btn-warning">Edit</a>
    <form method="POST" action="{{ route('production_batches.destroy', $batch) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this batch and reverse all inventory changes?')">Delete</button>
    </form>
    <a href="{{ route('production_batches.index') }}" class="btn btn-secondary">Back</a>
</div>
@endsection
