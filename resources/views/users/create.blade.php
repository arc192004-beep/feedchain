@extends('layouts.app')

@section('content')
<h3>Create User</h3>

<form method="POST" action="{{ route('users.store') }}">
  @csrf
  <div class="mb-3">
    <label class="form-label">Name</label>
    <input name="name" class="form-control" value="{{ old('name') }}">
  </div>
  <div class="mb-3">
    <label class="form-label">Email</label>
    <input name="email" class="form-control" value="{{ old('email') }}">
  </div>
  <div class="mb-3">
    <label class="form-label">Password</label>
    <input type="password" name="password" class="form-control">
  </div>
  <div class="mb-3">
    <label class="form-label">Confirm Password</label>
    <input type="password" name="password_confirmation" class="form-control">
  </div>
  <div class="mb-3">
    <label class="form-label">Role</label>
    <select name="role" class="form-select">
      <option value="super_admin">Super Admin</option>
      <option value="production_manager">Production Manager</option>
      <option value="administrator" selected>Administrator</option>
    </select>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" name="is_active" class="form-check-input" checked>
    <label class="form-check-label">Active</label>
  </div>
  <button class="btn btn-primary">Save</button>
</form>

@endsection
