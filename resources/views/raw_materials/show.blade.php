@extends('layouts.app')
@section('content')
<h3>Raw Material: {{ $material->material_name }}</h3>
<table class="table"><tr><th>Code</th><td>{{ $material->material_code }}</td></tr><tr><th>Type</th><td>{{ $material->material_type }}</td></tr>
<tr><th>Stock</th><td>{{ $material->current_stock }} {{ $material->unit }}</td></tr></table>
<a href="{{ route('raw_materials.index') }}" class="btn btn-secondary">Back</a>
@endsection
