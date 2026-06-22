@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Raw Materials</h3><a href="{{ route('raw_materials.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th><th>Type</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
@foreach($materials as $m)
<tr><td>{{ $m->id }}</td><td>{{ $m->material_code }}</td><td>{{ $m->material_name }}</td><td>{{ $m->material_type }}</td><td>{{ $m->current_stock }} {{ $m->unit }}</td>
<td><a href="{{ route('raw_materials.show',$m) }}" class="btn btn-sm btn-secondary">View</a></td></tr>
@endforeach
</tbody></table>
{{ $materials->links() }}
@endsection
