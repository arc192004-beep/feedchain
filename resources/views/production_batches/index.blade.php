@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Production Batches</h3><a href="{{ route('production_batches.create') }}" class="btn btn-primary">Record Batch</a></div>
<table class="table"><thead><tr><th>#</th><th>Batch No</th><th>Product</th><th>Date</th><th>Qty(kg)</th><th>Actions</th></tr></thead><tbody>
@foreach($batches as $b)
<tr>
    <td>{{ $b->id }}</td>
    <td>{{ $b->batch_no }}</td>
    <td>{{ $b->feedProduct->feed_name }}</td>
    <td>{{ $b->production_date->format('Y-m-d') }}</td>
    <td>{{ $b->quantity_kg }}</td>
    <td>
        <a href="{{ route('production_batches.show', $b) }}" class="text-blue-600 hover:underline">View</a> |
        <a href="{{ route('production_batches.edit', $b) }}" class="text-yellow-600 hover:underline">Edit</a> |
        <form action="{{ route('production_batches.destroy', $b) }}" method="POST" style="display:inline;" onsubmit="return confirm('Delete this batch and reverse inventory?');">
            @csrf @method('DELETE')
            <button type="submit" class="text-red-600 hover:underline" style="background:none; border:none; cursor:pointer;">Delete</button>
        </form>
    </td>
</tr>
@endforeach
</tbody></table>
{{ $batches->links() }}
@endsection
