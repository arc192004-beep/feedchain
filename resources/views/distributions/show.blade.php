@extends('layouts.app')
@section('content')
<h3>Distribution: {{ $distribution->distribution_number }}</h3>
<div class="alert alert-info">
    <p><strong>Buyer:</strong> {{ $distribution->buyer_name }}</p>
    <p><strong>Address:</strong> {{ $distribution->address }}</p>
    <p><strong>Contact:</strong> {{ $distribution->contact_number }}</p>
    <p><strong>Date:</strong> {{ $distribution->distribution_date->format('Y-m-d') }}</p>
    <p><strong>Total Quantity:</strong> {{ $distribution->total_quantity }} bags</p>
    <p><strong>Total Amount:</strong> {{ $distribution->total_amount }}</p>
    <p><strong>Status:</strong> {{ $distribution->status }}</p>
    <p><strong>Remarks:</strong> {{ $distribution->remarks ?? 'N/A' }}</p>
</div>

<h4>Distribution Items</h4>
<table class="table">
    <thead>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($distribution->items as $item)
        <tr>
            <td>{{ $item->feedProduct->product_name }}</td>
            <td>{{ $item->quantity }}</td>
            <td>{{ $item->unit_price }}</td>
            <td>{{ $item->line_total }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="d-flex gap-2">
    <a href="{{ route('distributions.edit', $distribution) }}" class="btn btn-warning">Edit</a>
    <form method="POST" action="{{ route('distributions.destroy', $distribution) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
    </form>
    <a href="{{ route('distributions.index') }}" class="btn btn-secondary">Back</a>
</div>
@endsection
