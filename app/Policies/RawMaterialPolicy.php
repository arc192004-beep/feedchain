<?php

namespace App\Policies;

use App\Models\RawMaterial;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RawMaterialPolicy
{
    private function isAuthorized(User $user): bool
    {
        return in_array($user->role, ['production_manager', 'super_admin']);
    }

    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function view(User $user, RawMaterial $rawMaterial): bool
    {
        return $this->isAuthorized($user);
    }

    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function update(User $user, RawMaterial $rawMaterial): bool
    {
        return $this->isAuthorized($user);
    }

    public function delete(User $user, RawMaterial $rawMaterial): bool
    {
        return $this->isAuthorized($user);
    }
}
