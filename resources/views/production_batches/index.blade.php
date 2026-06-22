@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Production Batches</h3><a href="{{ route('production_batches.create') }}" class="btn btn-primary">Record Batch</a></div>
<table class="table"><thead><tr><th>#</th><th>Batch No</th><th>Product</th><th>Date</th><th>Qty(kg)</th></tr></thead><tbody>
@foreach($batches as $b)
<tr><td>{{ $b->id }}</td><td>{{ $b->batch_no }}</td><td>{{ $b->feedProduct->feed_name }}</td><td>{{ $b->production_date }}</td><td>{{ $b->quantity_kg }}</td></tr>
@endforeach
</tbody></table>
{{ $batches->links() }}
@endsection
