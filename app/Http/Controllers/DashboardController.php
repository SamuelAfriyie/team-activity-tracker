<?php

namespace App\Http\Controllers;

use App\Console\Commands\GenerateDailyActivities;
use App\Models\DailyActivity;
use App\Services\DailyActivityService;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use DispatchesJobs;

    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        if (DailyActivity::where('activity_date', $date)->count() === 0) {
            app(DailyActivityService::class)->generate($date);
        }

        $columns = ['pending', 'done'];
        $activities = [];
        foreach ($columns as $col) {
            $activities[$col] = DailyActivity::with(['master', 'latestUpdate.user', 'updates.user'])
                ->forDate($date)
                ->where('status', $col)
                ->orderBy('position')
                ->get()
                ->map(function ($a) {
                    $a->latest_update = $a->latestUpdate;
                    return $a;
                });
        }

        return Inertia::render('Dashboard', [
            'activities' => $activities,
            'date' => $date,
        ]);
    }
}
