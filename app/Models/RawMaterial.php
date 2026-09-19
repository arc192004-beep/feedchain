<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class RawMaterial extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $fillable = [
        'material_code',
        'name',
        'material_name',
        'category',
        'material_type',
        'unit',
        'quantity',
        'quantity_on_hand',
        'reorder_level',
        'unit_cost',
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
