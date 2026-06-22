<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_code',
        'customer_name',
        'contact_person',
        'contact_number',
        'address',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
