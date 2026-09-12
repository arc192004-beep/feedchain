@extends('layouts.admin')

@section('title', 'Edit User')
@section('page_title', 'Edit User')

@section('content')
<form method="POST" action="{{ route('users.update', $user) }}" class="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
    @csrf @method('PUT')
    @include('users._form', ['user' => $user, 'edit' => true])
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Update User</button>
</form>
@endsection
