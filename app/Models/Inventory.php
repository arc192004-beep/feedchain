<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_type',
        'raw_material_id',
        'feed_product_id',
        'quantity',
        'reference_batch_id',
        'quantity_available',
        'unit',
        'last_updated',
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
