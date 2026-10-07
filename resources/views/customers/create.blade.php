@extends('layouts.app')
@section('content')
<h3>Add Customer</h3>
<form method="POST" action="{{ route('customers.store') }}">
    @csrf
    <div class="mb-3">
        <label>Customer Code (optional)</label>
        <input name="customer_code" class="form-control" value="{{ old('customer_code') }}" placeholder="Auto-generated if left blank">
    </div>
    <div class="mb-3">
        <label>Name</label>
        <input name="name" class="form-control" value="{{ old('name') }}" required>
    </div>
    <div class="mb-3">
        <label>Fish Cage</label>
        <input name="fish_cage" class="form-control" value="{{ old('fish_cage') }}">
    </div>
    <div class="mb-3">
        <label>Address</label>
        <input name="address" class="form-control" value="{{ old('address') }}" required>
    </div>
    <div class="mb-3">
        <label>Contact Number</label>
        <input name="contact_number" class="form-control" value="{{ old('contact_number') }}" required>
    </div>
    <div class="mb-3">
        <label>Email</label>
        <input type="email" name="email" class="form-control" value="{{ old('email') }}">
    </div>
    <div class="mb-3">
        <label>Status</label>
        <select name="status" class="form-select">
            <option value="active" {{ old('status', 'active') === 'active' ? 'selected' : '' }}>Active</option>
            <option value="inactive" {{ old('status') === 'inactive' ? 'selected' : '' }}>Inactive</option>
        </select>
    </div>
    <div class="d-flex gap-2">
        <button class="btn btn-primary">Save</button>
        <a href="{{ route('customers.index') }}" class="btn btn-secondary">Cancel</a>
    </div>
</form>
@endsection
