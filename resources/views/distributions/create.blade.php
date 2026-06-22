@extends('layouts.app')
@section('content')
<h3>Record Distribution</h3>
<form method="POST" action="{{ route('distributions.store') }}">@csrf
<div class="mb-3"><label>Distribution No</label><input name="distribution_no" class="form-control"></div>
<div class="mb-3"><label>Buyer</label><select name="buyer_id" class="form-select">@foreach($buyers as $b)<option value="{{ $b->id }}">{{ $b->buyer_name }}</option>@endforeach</select></div>
<div class="mb-3"><label>Date</label><input type="date" name="distribution_date" class="form-control" value="{{ date('Y-m-d') }}"></div>
<div class="mb-3"><label>Items (JSON)</label><textarea name="items" class="form-control" placeholder='[{"feed_product_id":1,"quantity":10,"unit_price":100}]'></textarea></div>
<button class="btn btn-primary">Save</button></form>
@endsection
