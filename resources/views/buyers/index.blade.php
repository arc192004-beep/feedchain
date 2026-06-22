@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between"><h3>Buyers</h3><a href="{{ route('buyers.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th></tr></thead><tbody>
@foreach($items as $b)<tr><td>{{ $b->id }}</td><td>{{ $b->buyer_code }}</td><td>{{ $b->buyer_name }}</td></tr>@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
