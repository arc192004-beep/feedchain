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