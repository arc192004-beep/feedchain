@php($user = $user ?? null)
@php($edit = $edit ?? false)

<div class="grid gap-4 md:grid-cols-2">
    <div>
        <label class="mb-1 block text-sm font-medium">Name</label>
        <input type="text" name="name" value="{{ old('name', $user->name ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Email</label>
        <input type="email" name="email" value="{{ old('email', $user->email ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Username</label>
        <input type="text" name="username" value="{{ old('username', $user->username ?? '') }}" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Password {{ $edit ? '(leave blank to keep current)' : '' }}</label>
        <input type="password" name="password" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Confirm Password</label>
        <input type="password" name="password_confirmation" class="w-full rounded-lg border border-slate-300 px-3 py-2">
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Role</label>
        <select name="role" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            @foreach(['super_admin' => 'Super Administrator', 'production_manager' => 'Production Manager', 'administrator' => 'Administrator'] as $value => $label)
                <option value="{{ $value }}" @selected(old('role', $user->role ?? 'administrator') === $value)>{{ $label }}</option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select name="status" class="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="active" @selected(old('status', $user->status ?? 'active') === 'active')>Active</option>
            <option value="inactive" @selected(old('status', $user->status ?? 'active') === 'inactive')>Inactive</option>
        </select>
    </div>
</div>
