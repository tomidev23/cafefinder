<?php

use App\Http\Controllers\Api\CafeController;
use App\Http\Controllers\Api\GeocodeController;
use App\Http\Controllers\Api\RouteController;
use Illuminate\Support\Facades\Route;

Route::get('/cafes', [CafeController::class, 'index'])->name('api.cafes.index');
Route::get('/cafes/{id}', [CafeController::class, 'show'])->name('api.cafes.show');

Route::get('/geocode', [GeocodeController::class, 'search'])->name('api.geocode');
Route::get('/places/search', [GeocodeController::class, 'search'])->name('api.places.search');

Route::get('/route', [RouteController::class, 'getRoute'])->name('api.route');
