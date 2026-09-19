<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class ProductionBatch extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $table = 'production_batches';

    protected $fillable = [
        'batch_number',
        'feed_product_id',
        'feed_formula_id',
        'batch_setting_id',
        'production_date',
        'quantity_kg',
        'quantity_produced',
        'sacks_produced',
        'total_sacks',
        'total_raw_material_used',
        'production_yield',
        'status',
        'notes',
        'started_at',
        'completed_at',
        'inventory_applied_at',
        'encoded_by',
        'assigned_manager_id',
    ];

    protected $dates = ['production_date'];

    protected $casts = [
        'production_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'quantity_kg' => 'float',
        'quantity_produced' => 'float',
        'sacks_produced' => 'integer',
        'total_sacks' => 'integer',
        'total_raw_material_used' => 'float',
        'production_yield' => 'float',
        'inventory_applied_at' => 'datetime',
    ];

    protected $appends = [
        'yield_percentage',
    ];

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

    public function getBatchNoAttribute()
    {
        return $this->batch_number;
    }

    public function getYieldPercentageAttribute(): float
    {
        if ($this->production_yield !== null) return (float) $this->production_yield;
        $totalRaw = (float) ($this->total_raw_material_used > 0 ? $this->total_raw_material_used : $this->materials->sum('quantity_used'));
        $bagWeight = (float) (optional($this->feedProduct)->bag_weight_kg ?? 25);
        $output = (float) ($this->quantity_kg > 0 ? $this->quantity_kg : (($this->sacks_produced ?? 0) * $bagWeight));
        return $totalRaw > 0 ? round(($output / $totalRaw) * 100, 1) : 100.0;
    }
}
