<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::policy(\App\Models\RawMaterial::class, \App\Policies\RawMaterialPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\FeedProduct::class, \App\Policies\FeedProductPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\FeedFormula::class, \App\Policies\FeedFormulaPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\ProductionBatch::class, \App\Policies\ProductionBatchPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Distribution::class, \App\Policies\DistributionPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Sale::class, \App\Policies\SalePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Customer::class, \App\Policies\CustomerPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Buyer::class, \App\Policies\BuyerPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Inventory::class, \App\Policies\InventoryPolicy::class);
    }
}
