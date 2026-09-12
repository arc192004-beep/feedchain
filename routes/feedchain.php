<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedFormulaController;
use App\Http\Controllers\FeedProductController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/feedchain/dashboard', [DashboardController::class, 'index'])->name('feedchain.dashboard');

    Route::middleware('role:super_admin')->group(function () {
        Route::get('/dashboard/super-admin', [DashboardController::class, 'superAdmin'])->name('dashboard.super_admin');
        Route::resource('users', UserController::class);
    });

    Route::middleware('role:super_admin,production_manager')->group(function () {
        Route::get('/dashboard/production', [DashboardController::class, 'production'])->name('dashboard.production');
    });

    Route::middleware('role:super_admin,administrator')->group(function () {
        Route::get('/dashboard/analytics', [DashboardController::class, 'analytics'])->name('dashboard.analytics');
    });

    Route::middleware('role:super_admin,production_manager')->group(function () {
        Route::resource('raw_materials', RawMaterialController::class);
        Route::resource('feed_products', FeedProductController::class);
        Route::resource('feed_formulas', FeedFormulaController::class);
    });
});
