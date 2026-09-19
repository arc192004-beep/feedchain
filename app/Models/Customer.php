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
        'fish_cage',
        'contact_number',
        'address',
        'email',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (Customer $customer) {
            // The legacy `customers` table requires `customer_name`; the
            // application-facing column is `name`.
            if (! $customer->customer_name) {
                $customer->customer_name = $customer->name;
            }

            if (! $customer->customer_code) {
                $customer->customer_code = 'CUST-'.$customer->workspace_id.'-'
                    .str_pad((string) (static::withoutGlobalScope('workspace')->max('id') + 1), 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
