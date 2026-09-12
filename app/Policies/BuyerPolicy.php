<?php

namespace App\Policies;

use App\Models\Buyer;
use App\Models\User;

class BuyerPolicy
{
    private function isAuthorized(User $user): bool
    {
        return in_array($user->role, ['production_manager', 'super_admin']);
    }

    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function view(User $user, Buyer $buyer): bool
    {
        return $this->isAuthorized($user);
    }

    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function update(User $user, Buyer $buyer): bool
    {
        return $this->isAuthorized($user);
    }

    public function delete(User $user, Buyer $buyer): bool
    {
        return $this->isAuthorized($user);
    }
}
