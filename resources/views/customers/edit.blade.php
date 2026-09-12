@extends('layouts.app')
@section('content')
<h3>Edit Customer</h3>
<form method="POST" action="{{ route('customers.update', $customer) }}">@csrf @method('PUT')
<div class="mb-3">
    <label>Name</label>
    <input name="name" class="form-control" value="{{ old('name', $customer->name) }}" required>
</div>
<div class="mb-3">
    <label>Fish Cage</label>
    <input name="fish_cage" class="form-control" value="{{ old('fish_cage', $customer->fish_cage) }}">
</div>
<div class="mb-3">
    <label>Address</label>
    <input name="address" class="form-control" value="{{ old('address', $customer->address) }}" required>
</div>
<div class="mb-3">
    <label>Contact Number</label>
    <input name="contact_number" class="form-control" value="{{ old('contact_number', $customer->contact_number) }}" required>
</div>
<div class="mb-3">
    <label>Email</label>
    <input type="email" name="email" class="form-control" value="{{ old('email', $customer->email) }}">
</div>
<div class="mb-3">
    <label>Status</label>
    <select name="status" class="form-select">
        <option value="active" {{ old('status', $customer->status ?? 'active') === 'active' ? 'selected' : '' }}>Active</option>
        <option value="inactive" {{ old('status', $customer->status) === 'inactive' ? 'selected' : '' }}>Inactive</option>
    </select>
</div>
<div class="d-flex gap-2">
    <button class="btn btn-primary">Update</button>
    <form method="POST" action="{{ route('customers.destroy', $customer) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button type="button" class="btn btn-danger" onclick="if(confirm('Are you sure you want to delete this customer?')) { this.form.submit(); }">Delete</button>
    </form>
    <a href="{{ route('customers.index') }}" class="btn btn-secondary">Cancel</a>
</div>
</form>
@endsection
