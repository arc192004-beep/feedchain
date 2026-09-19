<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class StockAlert extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $fillable = [
        'inventory_type',
        'raw_material_id',
        'feed_product_id',
        'current_quantity',
        'threshold_quantity',
        'alert_level',
        'alert_message',
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
