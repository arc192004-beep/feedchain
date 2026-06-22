<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware(['auth'])->group(function () {
    // Super Admin user management (use class-based middleware with parameter)
    Route::group(['middleware' => ['auth', \App\Http\Middleware\RoleMiddleware::class . ':super_admin']], function () {
        Route::resource('users', UserController::class);
    });

    // Core resources
    Route::resource('raw_materials', \App\Http\Controllers\RawMaterialController::class);
    Route::resource('feed_products', \App\Http\Controllers\FeedProductController::class);
    Route::resource('feed_formulations', \App\Http\Controllers\FeedFormulationController::class);
    Route::resource('batch_settings', \App\Http\Controllers\BatchSettingController::class);
    Route::resource('production_batches', \App\Http\Controllers\ProductionBatchController::class)->only(['index','create','store','show']);

    Route::resource('buyers', \App\Http\Controllers\BuyerController::class);
    Route::resource('distributions', \App\Http\Controllers\DistributionController::class)->only(['index','create','store']);
    Route::resource('customers', \App\Http\Controllers\CustomerController::class);
    Route::resource('sales', \App\Http\Controllers\SaleController::class)->only(['index','create','store']);

    Route::resource('wastage_records', \App\Http\Controllers\WastageRecordController::class)->only(['index','create','store']);
    Route::get('stock_alerts', [\App\Http\Controllers\StockAlertController::class,'index'])->name('stock_alerts.index');
    Route::post('stock_alerts/{stock_alert}/resolve', [\App\Http\Controllers\StockAlertController::class,'resolve'])->name('stock_alerts.resolve');
});
