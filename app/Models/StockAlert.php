<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'raw_material_id',
        'feed_product_id',
        'alert_type',
        'message',
        'status',
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
