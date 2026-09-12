@extends('layouts.app')
@section('content')
<h3>Edit Buyer</h3>
<form method="POST" action="{{ route('buyers.update', $buyer) }}">@csrf @method('PUT')
<div class="mb-3">
    <label>Name</label>
    <input name="buyer_name" class="form-control" value="{{ old('buyer_name', $buyer->buyer_name) }}" required>
    @error('buyer_name')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Fishpond/Cage Name</label>
    <input name="fishpond_or_cage_name" class="form-control" value="{{ old('fishpond_or_cage_name', $buyer->fishpond_or_cage_name) }}" required>
    @error('fishpond_or_cage_name')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Address</label>
    <input name="address" class="form-control" value="{{ old('address', $buyer->address) }}" required>
    @error('address')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="mb-3">
    <label>Contact Number</label>
    <input name="contact_number" class="form-control" value="{{ old('contact_number', $buyer->contact_number) }}" required>
    @error('contact_number')<span class="text-danger">{{ $message }}</span>@enderror
</div>
<div class="d-flex gap-2">
    <button class="btn btn-primary">Update</button>
    <a href="{{ route('buyers.index') }}" class="btn btn-secondary">Cancel</a>
</div>
</form>
@endsection
