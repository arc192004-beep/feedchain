@extends('layouts.app')
@section('content')
<h3>Create Formulation</h3>
<form method="POST" action="{{ route('feed_formulations.store') }}">@csrf
<div class="mb-3"><label>Product</label><select name="feed_product_id" class="form-select">@foreach($products as $p)<option value="{{ $p->id }}">{{ $p->feed_name }}</option>@endforeach</select></div>
<div class="mb-3"><label>Formula Name</label><input name="formula_name" class="form-control"></div>
<div class="mb-3"><label>Batch Size (kg)</label><input name="batch_size_kg" class="form-control" value="1000"></div>
<div class="mb-3"><label>Items (JSON array)</label><textarea name="items" class="form-control" placeholder='[{"raw_material_id":1,"quantity_required":100,"unit":"kg"}]'></textarea></div>
<button class="btn btn-primary">Save</button></form>
@endsection
