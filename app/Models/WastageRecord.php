<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class WastageRecord extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $fillable = [
        'raw_material_id',
        'production_batch_id',
        'wastage_type',
        'quantity',
        'remarks',
        'date_recorded',
    ];

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }

    public function productionBatch()
    {
        return $this->belongsTo(ProductionBatch::class, 'production_batch_id');
    }
}
