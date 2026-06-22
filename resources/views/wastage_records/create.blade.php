@extends('layouts.app')
@section('content')
<h3>Record Wastage</h3>
<form method="POST" action="{{ route('wastage_records.store') }}">@csrf
<div class="mb-3"><label>Raw Material</label><select name="raw_material_id" class="form-select">@foreach(App\Models\RawMaterial::all() as $m)<option value="{{ $m->id }}">{{ $m->material_name }}</option>@endforeach</select></div>
<div class="mb-3"><label>Type</label><select name="wastage_type" class="form-select"><option value="expired">Expired</option><option value="damaged">Damaged</option><option value="unused">Unused</option><option value="variance">Variance</option></select></div>
<div class="mb-3"><label>Quantity</label><input name="quantity" class="form-control"></div>
<div class="mb-3"><label>Date</label><input type="date" name="date_recorded" class="form-control" value="{{ date('Y-m-d') }}"></div>
<button class="btn btn-primary">Save</button></form>
@endsection
