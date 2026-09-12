@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Sales</h3><a href="{{ route('sales.create') }}" class="btn btn-primary">Record</a></div>
<table class="table"><thead><tr><th>#</th><th>No</th><th>Customer</th><th>Date</th><th>Total</th><th>Actions</th></tr></thead><tbody>
@foreach($items as $s)
<tr>
    <td>{{ $s->id }}</td>
    <td>{{ $s->sale_number ?? $s->sale_no }}</td>
    <td>{{ $s->customer->name ?? $s->customer->customer_name }}</td>
    <td>{{ $s->sale_date->format('Y-m-d') }}</td>
    <td>₱{{ number_format($s->total_amount, 2) }}</td>
    <td>
        <a href="{{ route('sales.show', $s) }}" class="text-blue-600 hover:underline">View</a> |
        <form action="{{ route('sales.destroy', $s) }}" method="POST" style="display:inline;" onsubmit="return confirm('Delete this sale?');">
            @csrf @method('DELETE')
            <button type="submit" class="text-red-600 hover:underline" style="background:none; border:none; cursor:pointer;">Delete</button>
        </form>
    </td>
</tr>
@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
