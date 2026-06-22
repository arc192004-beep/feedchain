<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_code',
        'material_name',
        'material_type',
        'unit',
        'quantity_on_hand',
        'reorder_level',
        'cost_per_unit',
        'status',
    ];

    public function formulaItems()
    {
        return $this->hasMany(FormulaItem::class);
    }

    public function productionMaterials()
    {
        return $this->hasMany(ProductionBatchMaterial::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function stockAlerts()
    {
        return $this->hasMany(StockAlert::class);
    }
}
