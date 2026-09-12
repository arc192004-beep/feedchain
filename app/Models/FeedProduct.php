<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_code',
        'name',
        'product_name',
        'feed_type',
        'description',
        'unit',
        'price',
        'status',
        'quantity_bags',
        'min_stock_bags',
        'bag_weight_kg',
    ];

    public function formulas()
    {
        return $this->hasMany(FeedFormula::class);
    }

    public function productionBatches()
    {
        return $this->hasMany(ProductionBatch::class);
    }

    public function distributionItems()
    {
        return $this->hasMany(DistributionItem::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
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
