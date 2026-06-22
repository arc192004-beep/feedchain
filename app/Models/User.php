<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function productionBatches()
    {
        return $this->hasMany(ProductionBatch::class, 'encoded_by');
    }

    public function distributions()
    {
        return $this->hasMany(Distribution::class, 'encoded_by');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class, 'encoded_by');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Role check helpers
    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    public function isProductionManager()
    {
        return $this->role === 'production_manager';
    }

    public function isAdministrator()
    {
        return $this->role === 'administrator';
    }
}
