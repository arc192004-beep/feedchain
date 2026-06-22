@extends('layouts.app')

@section('content')
<h3>User Details</h3>

<table class="table">
  <tr><th>ID</th><td>{{ $user->id }}</td></tr>
  <tr><th>Name</th><td>{{ $user->name }}</td></tr>
  <tr><th>Email</th><td>{{ $user->email }}</td></tr>
  <tr><th>Role</th><td>{{ $user->role }}</td></tr>
  <tr><th>Phone</th><td>{{ $user->phone }}</td></tr>
  <tr><th>Address</th><td>{{ $user->address }}</td></tr>
  <tr><th>Active</th><td>{{ $user->is_active? 'Yes':'No' }}</td></tr>
</table>

<a href="{{ route('users.index') }}" class="btn btn-secondary">Back</a>

@endsection
