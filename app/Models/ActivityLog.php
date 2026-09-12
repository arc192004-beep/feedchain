<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $table = 'activity_logs';

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    // The existing database uses Spatie-style log_name/properties columns.
    // Keep the application-facing action/module names compatible with it.
    public function setActionAttribute($value): void
    {
        $this->attributes['log_name'] = $value;
    }

    public function getActionAttribute(): ?string
    {
        return $this->attributes['log_name'] ?? null;
    }

    public function setModuleAttribute($value): void
    {
        $properties = isset($this->attributes['properties'])
            ? json_decode($this->attributes['properties'], true) ?: []
            : [];
        $properties['module'] = $value;
        $this->attributes['properties'] = json_encode($properties);
    }

    public function getModuleAttribute(): ?string
    {
        $properties = $this->properties ?? [];
        return $properties['module'] ?? null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
