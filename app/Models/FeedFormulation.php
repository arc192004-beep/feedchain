<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedFormulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'feed_product_id',
        'formula_name',
        'batch_size_kg',
        'notes',
    ];

    public function feedProduct()
    {
        return $this->belongsTo(FeedProduct::class, 'feed_product_id');
    }

    public function items()
    {
        return $this->hasMany(FeedFormulationItem::class, 'feed_formulation_id');
    }
}
