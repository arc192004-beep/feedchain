<?php

namespace App\Policies;

use App\Models\FeedFormula;
use App\Models\User;

class FeedFormulaPolicy
{
    private function isAuthorized(User $user): bool
    {
        return in_array($user->role, ['production_manager', 'super_admin']);
    }

    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function view(User $user, FeedFormula $feedFormula): bool
    {
        return $this->isAuthorized($user);
    }

    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function update(User $user, FeedFormula $feedFormula): bool
    {
        return $this->isAuthorized($user);
    }

    public function delete(User $user, FeedFormula $feedFormula): bool
    {
        return $this->isAuthorized($user);
    }
}
