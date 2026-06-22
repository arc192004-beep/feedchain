<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistributionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'distribution_id',
        'feed_product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    public function distribution()
    {
        return $this->belongsTo(Distribution::class, 'distribution_id');
    }

    public function feedProduct()
    {
        return $this->belongsTo(FeedProduct::class, 'feed_product_id');
    }
}
