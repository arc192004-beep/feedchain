<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedFormula extends Model
{
    use HasFactory;

    protected $table = 'feed_formulas';

    protected $fillable = [
        'formula_code',
        'formula_name',
        'feed_product_id',
        'batch_size_kg',
        'status',
    ];

    public function feedProduct()
    {
        return $this->belongsTo(FeedProduct::class);
    }

    public function items()
    {
        return $this->hasMany(FormulaItem::class, 'feed_formula_id');
    }

    public function productionBatches()
    {
        return $this->hasMany(ProductionBatch::class, 'feed_formula_id');
    }
}