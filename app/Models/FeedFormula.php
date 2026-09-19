<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class FeedFormula extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $table = 'feed_formulas';

    protected $fillable = [
        'formula_code',
        'name',
        'formula_name',
        'feed_product_id',
        'batch_size',
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
