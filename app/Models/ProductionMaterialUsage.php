<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class ProductionMaterialUsage extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $fillable = [
        'production_batch_id',
        'raw_material_id',
        'quantity_used',
        'unit',
    ];

    public function batch()
    {
        return $this->belongsTo(ProductionBatch::class, 'production_batch_id');
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }
}
