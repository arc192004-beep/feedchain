@extends('layouts.app')
@section('content')
<h3>Add Raw Material</h3>
<form method="POST" action="{{ route('raw_materials.store') }}">@csrf
<div class="mb-3"><label>Code</label><input name="material_code" class="form-control"></div>
<div class="mb-3"><label>Name</label><input name="material_name" class="form-control"></div>
<div class="mb-3"><label>Type</label><input name="material_type" class="form-control"></div>
<div class="mb-3"><label>Unit</label><input name="unit" class="form-control" value="kg"></div>
<div class="mb-3"><label>Current Stock</label><input name="current_stock" class="form-control" value="0"></div>
<button class="btn btn-primary">Save</button></form>
@endsection
