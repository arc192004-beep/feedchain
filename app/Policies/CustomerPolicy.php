<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    private function isAuthorized(User $user): bool
    {
        return in_array($user->role, ['production_manager', 'super_admin']);
    }

    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function view(User $user, Customer $customer): bool
    {
        return $this->isAuthorized($user);
    }

    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    public function update(User $user, Customer $customer): bool
    {
        return $this->isAuthorized($user);
    }

    public function delete(User $user, Customer $customer): bool
    {
        return $this->isAuthorized($user);
    }
}
