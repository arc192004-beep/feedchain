@extends('layouts.app')

@section('content')
<div class="d-flex justify-content-between mb-3">
  <h3>Users</h3>
  <a href="{{ route('users.create') }}" class="btn btn-primary">Create User</a>
</div>

<form method="GET" class="mb-3">
  <div class="input-group">
    <input type="text" name="q" class="form-control" placeholder="Search" value="{{ request('q') }}">
    <button class="btn btn-outline-secondary">Search</button>
  </div>
</form>

<table class="table table-striped">
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Active</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    @foreach($users as $user)
    <tr>
      <td>{{ $user->id }}</td>
      <td>{{ $user->name }}</td>
      <td>{{ $user->email }}</td>
      <td>{{ $user->role }}</td>
      <td>{{ $user->is_active ? 'Yes' : 'No' }}</td>
      <td>
        <a href="{{ route('users.show', $user) }}" class="btn btn-sm btn-secondary">View</a>
        <a href="{{ route('users.edit', $user) }}" class="btn btn-sm btn-warning">Edit</a>
        <form action="{{ route('users.destroy', $user) }}" method="POST" style="display:inline">@csrf @method('DELETE')
          <button class="btn btn-sm btn-danger" onclick="return confirm('Delete user?')">Delete</button>
        </form>
      </td>
    </tr>
    @endforeach
  </tbody>
</table>

{{ $users->withQueryString()->links() }}

@endsection
