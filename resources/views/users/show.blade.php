@extends('layouts.admin')

@section('title', 'User Details')
@section('page_title', 'User Details')

@section('content')
<div class="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
    <dl class="grid gap-4 md:grid-cols-2">
        <div><dt class="text-sm text-slate-500">Name</dt><dd class="font-medium">{{ $user->name }}</dd></div>
        <div><dt class="text-sm text-slate-500">Email</dt><dd class="font-medium">{{ $user->email }}</dd></div>
        <div><dt class="text-sm text-slate-500">Role</dt><dd class="font-medium capitalize">{{ str_replace('_', ' ', $user->role) }}</dd></div>
        <div><dt class="text-sm text-slate-500">Status</dt><dd class="font-medium">{{ ucfirst($user->status) }}</dd></div>
    </dl>
    <div class="mt-6 flex gap-3">
        <a href="{{ route('users.edit', $user) }}" class="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white">Edit</a>
        <a href="{{ route('users.index') }}" class="rounded-lg bg-slate-200 px-4 py-2 text-sm">Back</a>
    </div>
</div>
@endsection
