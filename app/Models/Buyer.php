<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_code',
        'buyer_name',
        'contact_person',
        'contact_number',
        'address',
        'fishpond_or_cage_name',
    ];

    public function distributions()
    {
        return $this->hasMany(Distribution::class);
    }
}
