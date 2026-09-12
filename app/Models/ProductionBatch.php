<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionBatch extends Model
{
    use HasFactory;

    protected $table = 'production_batches';

    protected $fillable = [
        'batch_number',
        'feed_product_id',
        'feed_formula_id',
        'batch_setting_id',
        'production_date',
        'quantity_kg',
        'sacks_produced',
        'total_raw_material_used',
        'status',
        'encoded_by',
    ];

    protected $dates = ['production_date'];

    public function feedProduct()
    {
        return $this->belongsTo(FeedProduct::class);
    }

    public function formula()
    {
        return $this->belongsTo(FeedFormula::class, 'feed_formula_id');
    }

    public function batchSetting()
    {
        return $this->belongsTo(BatchSetting::class, 'batch_setting_id');
    }

    public function materials()
    {
        return $this->hasMany(ProductionBatchMaterial::class, 'production_batch_id');
    }

    public function usages()
    {
        return $this->materials();
    }

    public function encodedBy()
    {
        return $this->belongsTo(User::class, 'encoded_by');
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'reference_batch_id');
    }
}
