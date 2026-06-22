@extends('layouts.app')
@section('content')
<h3>Add Feed Product</h3>
<form method="POST" action="{{ route('feed_products.store') }}">@csrf
<div class="mb-3"><label>Code</label><input name="product_code" class="form-control"></div>
<div class="mb-3"><label>Name</label><input name="feed_name" class="form-control"></div>
<div class="mb-3"><label>Type</label><input name="feed_type" class="form-control"></div>
<div class="mb-3"><label>Unit weight (kg)</label><input name="unit_weight_kg" class="form-control" value="1"></div>
<button class="btn btn-primary">Save</button></form>
@endsection
