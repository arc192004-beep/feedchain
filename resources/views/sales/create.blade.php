@extends('layouts.app')
@section('content')
<h3>Record Sale</h3>
<form method="POST" action="{{ route('sales.store') }}">@csrf
<div class="mb-3"><label>Sale No</label><input name="sale_no" class="form-control"></div>
<div class="mb-3"><label>Customer</label><select name="customer_id" class="form-select">@foreach($customers as $c)<option value="{{ $c->id }}">{{ $c->customer_name }}</option>@endforeach</select></div>
<div class="mb-3"><label>Date</label><input type="date" name="sale_date" class="form-control" value="{{ date('Y-m-d') }}"></div>
<div class="mb-3"><label>Items (JSON)</label><textarea name="items" class="form-control" placeholder='[{"feed_product_id":1,"quantity":10,"unit_price":100}]'></textarea></div>
<button class="btn btn-primary">Save</button></form>
@endsection
