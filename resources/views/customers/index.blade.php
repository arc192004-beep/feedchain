@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between"><h3>Customers</h3><a href="{{ route('customers.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th></tr></thead><tbody>
@foreach($items as $c)<tr><td>{{ $c->id }}</td><td>{{ $c->customer_code }}</td><td>{{ $c->customer_name }}</td></tr>@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
