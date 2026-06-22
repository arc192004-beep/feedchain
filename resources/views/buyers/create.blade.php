@extends('layouts.app')
@section('content')
<h3>Add Buyer</h3>
<form method="POST" action="{{ route('buyers.store') }}">@csrf
<div class="mb-3"><label>Code</label><input name="buyer_code" class="form-control"></div>
<div class="mb-3"><label>Name</label><input name="buyer_name" class="form-control"></div>
<div class="mb-3"><label>Type</label><select name="buyer_type" class="form-select"><option value="buyer">Buyer</option><option value="fishpond">Fishpond</option><option value="fish_cage">Fish Cage</option></select></div>
<button class="btn btn-primary">Save</button></form>
@endsection
