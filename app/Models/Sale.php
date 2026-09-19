<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use BelongsToWorkspace, HasFactory;

    protected $fillable = [
        'customer_id',
        'sale_date',
        'sales_date',
        'sales_number',
        'customer_name',
        'total_amount',
        'feed_product_id',
        'quantity',
        'status',
        'notes',
        'encoded_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class, 'sale_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
