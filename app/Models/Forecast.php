<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class Forecast extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $fillable = [
        'forecast_type',
        'reference_id',
        'forecast_period',
        'predicted_value',
        'model_used',
        'notes',
    ];
}
