<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionBatchMaterial extends Model
{
    use HasFactory;

    protected $table = 'production_batch_materials';

    protected $fillable = [
        'production_batch_id',
        'raw_material_id',
        'quantity_used',
        'unit',
        'unit_cost',
    ];

    public function batch()
    {
        return $this->belongsTo(ProductionBatch::class, 'production_batch_id');
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }

    /**
     * Get unit, falling back to related raw material's unit if not set.
     */
    public function getUnitAttribute($value)
    {
        if (! empty($value)) {
            return $value;
        }

        return $this->rawMaterial?->unit ?? 'kg';
    }
}