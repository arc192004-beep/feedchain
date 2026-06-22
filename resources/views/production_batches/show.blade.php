@extends('layouts.app')
@section('content')
<h3>Batch {{ $batch->batch_no }}</h3>
<p>Product: {{ $batch->feedProduct->feed_name }}</p>
<p>Date: {{ $batch->production_date }}</p>
<p>Quantity: {{ $batch->quantity_kg }}</p>
<h4>Material Usages</h4>
<table class="table"><thead><tr><th>Material</th><th>Qty</th></tr></thead><tbody>
@foreach($batch->usages as $u)
<tr><td>{{ $u->rawMaterial->material_name }}</td><td>{{ $u->quantity_used }} {{ $u->unit }}</td></tr>
@endforeach
</tbody></table>
@endsection
