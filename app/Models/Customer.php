<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use BelongsToWorkspace, HasFactory;

    protected $fillable = [
        'customer_code',
        'name',
        'customer_name',
        'fish_cage',
        'contact_number',
        'address',
        'email',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (Customer $customer) {
            if (! $customer->customer_code) {
                $workspaceId = $customer->workspace_id ?? \Illuminate\Support\Facades\Auth::user()?->workspace_id ?? 1;
                $customer->customer_code = 'CUST-'.$workspaceId.'-'
                    .str_pad((string) (static::withoutGlobalScope('workspace')->max('id') + 1), 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function setCustomerNameAttribute(?string $value): void
    {
        $this->attributes['name'] = $value;
    }

    public function getCustomerNameAttribute(): ?string
    {
        return $this->attributes['name'] ?? null;
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
