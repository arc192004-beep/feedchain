<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Distribution extends Model
{
    use HasFactory;

    protected $table = 'distributions';

    protected $fillable = [
        'distribution_number',
        'transaction_number',
        'buyer_id',
        'buyer_name',
        'address',
        'contact_number',
        'distribution_date',
        'delivery_date',
        'total_quantity',
        'total_amount',
        'remarks',
        'status',
        'encoded_by',
    ];

    protected $dates = ['distribution_date'];

    public function buyer()
    {
        return $this->belongsTo(Buyer::class);
    }

    public function items()
    {
        return $this->hasMany(DistributionItem::class);
    }

    public function encodedBy()
    {
        return $this->belongsTo(User::class, 'encoded_by');
    }
}
