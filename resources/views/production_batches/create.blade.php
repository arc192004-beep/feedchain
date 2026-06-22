@extends('layouts.app')
@section('content')
<h3>Record Production Batch</h3>
<form method="POST" action="{{ route('production_batches.store') }}">@csrf
<div class="mb-3"><label>Batch No</label><input name="batch_no" class="form-control"></div>
<div class="mb-3"><label>Feed Product ID</label><input name="feed_product_id" class="form-control"></div>
<div class="mb-3"><label>Feed Formulation ID</label><input name="feed_formulation_id" class="form-control"></div>
<div class="mb-3"><label>Production Date</label><input type="date" name="production_date" class="form-control" value="{{ date('Y-m-d') }}"></div>
<div class="mb-3"><label>Quantity (kg)</label><input name="quantity_kg" class="form-control" value="1000"></div>
<div class="mb-3"><label>Sacks Produced</label><input name="sacks_produced" class="form-control" value="0"></div>
<button class="btn btn-primary">Save</button></form>
@endsection
