@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Customers</h3><a href="{{ route('customers.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead><tbody>
@foreach($items as $c)
<tr>
    <td>{{ $c->id }}</td>
    <td>{{ $c->customer_code }}</td>
    <td>{{ $c->name }}</td>
    <td>{{ $c->contact_number }}</td>
    <td><span class="badge {{ $c->status === 'active' ? 'bg-success' : 'bg-danger' }}">{{ ucfirst($c->status) }}</span></td>
    <td>
        <a href="{{ route('customers.show', $c) }}" class="text-blue-600 hover:underline">View</a> |
        <a href="{{ route('customers.edit', $c) }}" class="text-yellow-600 hover:underline">Edit</a> |
        <form action="{{ route('customers.destroy', $c) }}" method="POST" style="display:inline;" onsubmit="return confirm('Delete this customer?');">
            @csrf @method('DELETE')
            <button type="submit" class="text-red-600 hover:underline" style="background:none; border:none; cursor:pointer;">Delete</button>
        </form>
    </td>
</tr>
@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
