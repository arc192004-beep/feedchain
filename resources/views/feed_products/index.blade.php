@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Feed Products</h3><a href="{{ route('feed_products.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th><th>Type</th><th>Weight(kg)</th></tr></thead><tbody>
@foreach($items as $p)
<tr><td>{{ $p->id }}</td><td>{{ $p->product_code }}</td><td>{{ $p->feed_name }}</td><td>{{ $p->feed_type }}</td><td>{{ $p->unit_weight_kg }}</td></tr>
@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
