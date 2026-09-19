<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class FormulaItem extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $table = 'formula_items';

    protected $fillable = [
        'feed_formula_id',
        'raw_material_id',
        'quantity_required',
        'unit',
    ];

    public function formula()
    {
        return $this->belongsTo(FeedFormula::class, 'feed_formula_id');
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }
}