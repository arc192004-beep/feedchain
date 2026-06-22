@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between"><h3>Distributions</h3><a href="{{ route('distributions.create') }}" class="btn btn-primary">Record</a></div>
<table class="table"><thead><tr><th>#</th><th>No</th><th>Buyer</th><th>Date</th><th>Total Qty</th></tr></thead><tbody>
@foreach($items as $d)<tr><td>{{ $d->id }}</td><td>{{ $d->distribution_no }}</td><td>{{ $d->buyer->buyer_name }}</td><td>{{ $d->distribution_date }}</td><td>{{ $d->total_quantity }}</td></tr>@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
