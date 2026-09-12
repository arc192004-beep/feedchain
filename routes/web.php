<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedFormulaController;
use App\Http\Controllers\FeedProductController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DistributionController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ProductionBatchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InventoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('feedchain.dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {

    // Default dashboard route after login
    Route::get('/dashboard', function () {
        return redirect()->route('feedchain.dashboard');
    })->name('dashboard');

    // Main FeedChain dashboard
    Route::get('/feedchain/dashboard', [DashboardController::class, 'index'])
        ->name('feedchain.dashboard');

    // SUPER ADMIN
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/dashboard/super-admin', [DashboardController::class, 'superAdmin'])
            ->name('dashboard.super_admin');

        Route::resource('users', UserController::class);
    });

    // PRODUCTION MANAGER operational CRUD only
    Route::middleware('role:production_manager,super_admin')->group(function () {
        Route::get('/dashboard/production', [DashboardController::class, 'production'])
            ->name('dashboard.production');

        Route::resource('raw_materials', RawMaterialController::class);
        Route::resource('feed_products', FeedProductController::class);
        Route::resource('feed_formulas', FeedFormulaController::class);
        Route::resource('production_batches', ProductionBatchController::class);
        Route::resource('buyers', BuyerController::class);
        Route::resource('customers', CustomerController::class);
        Route::resource('distributions', DistributionController::class);
        Route::resource('sales', SaleController::class)->except(['create', 'edit']);
        Route::get('/inventory/movements', [InventoryController::class, 'movements'])->name('inventory.movements');
        Route::resource('inventory', InventoryController::class)->only(['index', 'store']);
    });

    // ADMINISTRATOR monitoring and analytics only
    Route::middleware('role:administrator')->group(function () {
        Route::get('/dashboard/analytics', [DashboardController::class, 'analytics'])
            ->name('dashboard.analytics');
    });
});

require __DIR__.'/auth.php';
