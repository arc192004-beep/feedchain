@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between mb-3"><h3>Buyers</h3><a href="{{ route('buyers.create') }}" class="btn btn-primary">Add</a></div>
<table class="table"><thead><tr><th>#</th><th>Code</th><th>Name</th><th>Contact</th><th>Actions</th></tr></thead><tbody>
@foreach($items as $b)
<tr>
    <td>{{ $b->id }}</td>
    <td>{{ $b->buyer_code }}</td>
    <td>{{ $b->buyer_name }}</td>
    <td>{{ $b->contact_number }}</td>
    <td>
        <a href="{{ route('buyers.show', $b) }}" class="text-blue-600 hover:underline">View</a> |
        <a href="{{ route('buyers.edit', $b) }}" class="text-yellow-600 hover:underline">Edit</a> |
        <form action="{{ route('buyers.destroy', $b) }}" method="POST" style="display:inline;" onsubmit="return confirm('Delete this buyer?');">
            @csrf @method('DELETE')
            <button type="submit" class="text-red-600 hover:underline" style="background:none; border:none; cursor:pointer;">Delete</button>
        </form>
    </td>
</tr>
@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
