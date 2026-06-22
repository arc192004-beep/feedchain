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
        'buyer_type',
        'contact_person',
        'contact_number',
        'address',
    ];

    public function distributions()
    {
        return $this->hasMany(Distribution::class);
    }
}
