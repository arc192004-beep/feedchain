<?php

namespace App\Policies;

use App\Models\Sale;
use App\Models\User;

class SalePolicy
{
    private function isAuthorized(User $user): bool
    {
        return in_array($user->role, ['production_manager', 'super_admin']);
    }

    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function view(User $user, Sale $sale): bool
    {
        return $this->isAuthorized($user);
    }

    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function update(User $user, Sale $sale): bool
    {
        return $this->isAuthorized($user);
    }

    public function delete(User $user, Sale $sale): bool
    {
        return $this->isAuthorized($user);
    }
}
