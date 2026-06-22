@extends('layouts.app')
@section('content')
<h3>Add Customer</h3>
<form method="POST" action="{{ route('customers.store') }}">@csrf
<div class="mb-3"><label>Code</label><input name="customer_code" class="form-control"></div>
<div class="mb-3"><label>Name</label><input name="customer_name" class="form-control"></div>
<button class="btn btn-primary">Save</button></form>
@endsection
