<?php

use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthController::class, 'create'])->name('Dashboard');

Route::get('/activities', [ActivitiesController::class, 'index'])->name('activities');
Route::get('/activities/create', [ActivitiesController::class, 'create'])->name('activities.create');
Route::get('/activities/show', [ActivitiesController::class, 'show'])->name('activities.show');