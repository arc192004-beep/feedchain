<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class BatchSetting extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $fillable = [
        'setting_name',
        'feed_product_id',
        'standard_batch_kg',
        'sacks_per_batch',
        'remarks',
    ];

    public function feedProduct()
    {
        return $this->belongsTo(FeedProduct::class, 'feed_product_id');
    }
}
