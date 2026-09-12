@extends('layouts.admin')

@section('title', 'Create User')
@section('page_title', 'Create User')

@section('content')
<form method="POST" action="{{ route('users.store') }}" class="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
    @csrf
    @include('users._form')
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Save User</button>
</form>
@endsection
