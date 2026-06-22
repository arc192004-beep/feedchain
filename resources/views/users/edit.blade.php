@extends('layouts.app')

@section('content')
<h3>Edit User</h3>

<form method="POST" action="{{ route('users.update', $user) }}">
  @csrf @method('PUT')
  <div class="mb-3">
    <label class="form-label">Name</label>
    <input name="name" class="form-control" value="{{ old('name', $user->name) }}">
  </div>
  <div class="mb-3">
    <label class="form-label">Email</label>
    <input name="email" class="form-control" value="{{ old('email', $user->email) }}">
  </div>
  <div class="mb-3">
    <label class="form-label">Password (leave blank to keep)</label>
    <input type="password" name="password" class="form-control">
  </div>
  <div class="mb-3">
    <label class="form-label">Confirm Password</label>
    <input type="password" name="password_confirmation" class="form-control">
  </div>
  <div class="mb-3">
    <label class="form-label">Role</label>
    <select name="role" class="form-select">
      <option value="super_admin" {{ $user->role==='super_admin'? 'selected':'' }}>Super Admin</option>
      <option value="production_manager" {{ $user->role==='production_manager'? 'selected':'' }}>Production Manager</option>
      <option value="administrator" {{ $user->role==='administrator'? 'selected':'' }}>Administrator</option>
    </select>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" name="is_active" class="form-check-input" {{ $user->is_active? 'checked':'' }}>
    <label class="form-check-label">Active</label>
  </div>
  <button class="btn btn-primary">Update</button>
</form>

@endsection
