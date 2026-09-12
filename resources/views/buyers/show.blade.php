@extends('layouts.app')
@section('content')
<h3>Buyer: {{ $buyer->buyer_name }}</h3>
<div class="alert alert-info">
    <p><strong>Code:</strong> {{ $buyer->buyer_code }}</p>
    <p><strong>Name:</strong> {{ $buyer->buyer_name }}</p>
    <p><strong>Fishpond/Cage:</strong> {{ $buyer->fishpond_or_cage_name }}</p>
    <p><strong>Address:</strong> {{ $buyer->address }}</p>
    <p><strong>Contact:</strong> {{ $buyer->contact_number }}</p>
</div>

<div class="d-flex gap-2">
    <a href="{{ route('buyers.edit', $buyer) }}" class="btn btn-warning">Edit</a>
    <form method="POST" action="{{ route('buyers.destroy', $buyer) }}" style="display:inline;">
        @csrf @method('DELETE')
        <button class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
    </form>
    <a href="{{ route('buyers.index') }}" class="btn btn-secondary">Back</a>
</div>
@endsection
