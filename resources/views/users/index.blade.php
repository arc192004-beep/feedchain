@extends('layouts.admin')

@section('title', 'Users')
@section('page_title', 'User Management')
@section('page_subtitle', 'Manage accounts and role-based access')

@section('content')
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <form method="GET" class="flex gap-2">
        <input type="text" name="q" value="{{ request('q') }}" placeholder="Search users..." class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">Search</button>
    </form>
    <a href="{{ route('users.create') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Create User</a>
</div>

<div class="overflow-hidden rounded-xl bg-white shadow-sm">
    <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-slate-600">
            <tr>
                <th class="px-4 py-3">#</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
                <tr class="border-t border-slate-100">
                    <td class="px-4 py-3">{{ $user->id }}</td>
                    <td class="px-4 py-3 font-medium">{{ $user->name }}</td>
                    <td class="px-4 py-3">{{ $user->email }}</td>
                    <td class="px-4 py-3 capitalize">{{ str_replace('_', ' ', $user->role) }}</td>
                    <td class="px-4 py-3">
                        <span class="rounded-full px-2 py-1 text-xs {{ $user->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                            {{ ucfirst($user->status) }}
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <a href="{{ route('users.show', $user) }}" class="text-blue-600 hover:underline">View</a>
                            <a href="{{ route('users.edit', $user) }}" class="text-amber-600 hover:underline">Edit</a>
                            @if($user->id !== auth()->id())
                                <form action="{{ route('users.destroy', $user) }}" method="POST" onsubmit="return confirm('Delete this user?')">
                                    @csrf @method('DELETE')
                                    <button class="text-red-600 hover:underline">Delete</button>
                                </form>
                            @endif
                        </div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="mt-4">{{ $users->withQueryString()->links() }}</div>
@endsection
