<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_type',
        'raw_material_id',
        'feed_product_id',
        'reference_type',
        'reference_id',
        'movement_type',
        'quantity',
        'balance_after',
        'remarks',
        'transaction_date',
    ];

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }

    public function feedProduct()
    {
        return $this->belongsTo(FeedProduct::class, 'feed_product_id');
    }
}
