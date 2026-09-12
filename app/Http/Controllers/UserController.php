<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:super_admin']);
    }

    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderByDesc('id')->paginate(15);

        return view('users.index', compact('users'));
    }

    public function create()
    {
        return view('users.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:super_admin,production_manager,administrator',
            'status' => 'required|in:active,inactive',
        ]);

        $user = User::create($data);
        $this->log('create_account', "Created account {$user->username} with role {$user->role}");

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }

    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'role' => 'required|in:super_admin,production_manager,administrator',
            'status' => 'required|in:active,inactive',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $isRoleChange = $user->role !== $data['role'];
        $isStatusChange = $user->status !== $data['status'];
        $this->ensureFinalSuperAdminRemainsActive($user, $data);
        $user->update($data);
        $this->log($isRoleChange ? 'role_assignment' : ($isStatusChange ? 'account_status_change' : 'update_account'), "Updated account {$user->username}");

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $this->ensureFinalSuperAdminRemainsActive($user, ['role' => 'deleted', 'status' => 'inactive']);

        $user->delete();
        $this->log('delete_account', "Deleted account {$user->username}");

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    private function ensureFinalSuperAdminRemainsActive(User $user, array $changes): void
    {
        if ($user->role !== 'super_admin') return;
        $remainsActiveSuperAdmin = ($changes['role'] ?? 'super_admin') === 'super_admin'
            && ($changes['status'] ?? 'active') === 'active';
        if ($remainsActiveSuperAdmin) return;
        if (User::where('role', 'super_admin')->where('status', 'active')->count() <= 1) {
            abort(422, 'The final active Super Administrator cannot be deactivated, reassigned, or deleted.');
        }
    }

    private function log(string $action, string $description): void
    {
        ActivityLog::create(['user_id' => auth()->id(), 'action' => $action, 'module' => 'user_management', 'description' => $description]);
    }
}
