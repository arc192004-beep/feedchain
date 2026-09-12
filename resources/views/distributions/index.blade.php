@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Distributions</h3><a href="{{ route('distributions.create') }}" class="btn btn-primary">Record</a></div>
<table class="table"><thead><tr><th>#</th><th>No</th><th>Buyer</th><th>Date</th><th>Total Qty</th><th>Actions</th></tr></thead><tbody>
@foreach($items as $d)
<tr>
    <td>{{ $d->id }}</td>
    <td>{{ $d->distribution_number ?? $d->distribution_no }}</td>
    <td>{{ $d->buyer->buyer_name }}</td>
    <td>{{ $d->distribution_date->format('Y-m-d') }}</td>
    <td>{{ $d->total_quantity }}</td>
    <td>
        <a href="{{ route('distributions.show', $d) }}" class="text-blue-600 hover:underline">View</a> |
        <a href="{{ route('distributions.edit', $d) }}" class="text-yellow-600 hover:underline">Edit</a> |
        <form action="{{ route('distributions.destroy', $d) }}" method="POST" style="display:inline;" onsubmit="return confirm('Delete this distribution and reverse inventory?');">
            @csrf @method('DELETE')
            <button type="submit" class="text-red-600 hover:underline" style="background:none; border:none; cursor:pointer;">Delete</button>
        </form>
    </td>
</tr>
@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
