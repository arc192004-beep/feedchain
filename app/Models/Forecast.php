<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Forecast extends Model
{
    use HasFactory;

    protected $fillable = [
        'forecast_type',
        'reference_id',
        'forecast_period',
        'predicted_value',
        'model_used',
        'notes',
    ];
}
