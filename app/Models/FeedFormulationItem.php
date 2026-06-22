<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedFormulationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'feed_formulation_id',
        'raw_material_id',
        'quantity_required',
        'unit',
    ];

    public function formulation()
    {
        return $this->belongsTo(FeedFormulation::class, 'feed_formulation_id');
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }
}
