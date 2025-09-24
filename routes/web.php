<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DailyActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterActivityController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'index'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});


Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get(
        '/daily-activities/{dailyActivity}',
        [DailyActivityController::class, 'show']
    )->name('daily.show');
    Route::patch(
        '/daily-activities/{dailyActivity}',
        [DailyActivityController::class, 'update']
    )->name('daily.update');
    Route::post(
        '/daily-activities/reorder',
        [DailyActivityController::class, 'reorder']
    )->name('daily.reorder');
    // Master activities CRUD (admins)
    Route::resource(
        'master-activities',
        MasterActivityController::class
    )->except(['show']);

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    // Route::get('/daily-activities/{dailyActivity}/show', [DailyActivityController::class, 'show'])->name('daily.show');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});


// Redirect any unknown routes to login
Route::fallback(function () {
    return redirect('/login');
});
