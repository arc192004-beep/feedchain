@extends('layouts.app')
@section('content')
<h3>Customer: {{ $customer->name }}</h3>
<div class="alert alert-info">
    <p><strong>Code:</strong> {{ $customer->customer_code }}</p>
    <p><strong>Name:</strong> {{ $customer->name }}</p>
    <p><strong>Fish Cage:</strong> {{ $customer->fish_cage ?? 'N/A' }}</p>
    <p><strong>Address:</strong> {{ $customer->address }}</p>
    <p><strong>Contact Number:</strong> {{ $customer->contact_number }}</p>
    <p><strong>Email:</strong> {{ $customer->email ?? 'N/A' }}</p>
    <p><strong>Status:</strong> <span class="badge {{ $customer->status === 'active' ? 'bg-success' : 'bg-danger' }}">{{ ucfirst($customer->status) }}</span></p>
</div>

<div class="d-flex gap-2">
    <a href="{{ route('customers.edit', $customer) }}" class="btn btn-warning">Edit</a>
    <form method="POST" action="{{ route('customers.destroy', $customer) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this customer?')">Delete</button>
    </form>
    <a href="{{ route('customers.index') }}" class="btn btn-secondary">Back</a>
</div>
@endsection
