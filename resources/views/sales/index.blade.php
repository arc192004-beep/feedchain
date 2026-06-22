@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between"><h3>Sales</h3><a href="{{ route('sales.create') }}" class="btn btn-primary">Record</a></div>
<table class="table"><thead><tr><th>#</th><th>No</th><th>Customer</th><th>Date</th><th>Total</th></tr></thead><tbody>
@foreach($items as $s)<tr><td>{{ $s->id }}</td><td>{{ $s->sale_no }}</td><td>{{ $s->customer->customer_name }}</td><td>{{ $s->sale_date }}</td><td>{{ $s->total_amount }}</td></tr>@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
