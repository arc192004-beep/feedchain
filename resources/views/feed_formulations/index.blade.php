@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Feed Formulations</h3><a href="{{ route('feed_formulations.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Formula</th><th>Product</th><th>Batch Size(kg)</th></tr></thead><tbody>
@foreach($items as $f)
<tr><td>{{ $f->id }}</td><td>{{ $f->formula_name }}</td><td>{{ $f->feedProduct->feed_name }}</td><td>{{ $f->batch_size_kg }}</td></tr>
@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
