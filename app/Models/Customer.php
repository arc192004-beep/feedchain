<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'fish_cage',
        'contact_number',
        'address',
        'email',
        'status',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
