<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\BelongsToWorkspace;

class ForecastRecord extends Model
{
    use HasFactory, BelongsToWorkspace;

    protected $table = 'forecast_records';

    protected $fillable = [
        'forecast_type',
        'reference_period',
        'predicted_value',
        'notes',
    ];
}