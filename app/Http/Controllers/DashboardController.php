<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
     public function index()
    {
         $today = Carbon::today();

        $teamStats = [
            'totalActivities' => Activity::where('is_active', true)->count(),
            'teamMembers' => User::where('is_active', true)->count(),
            'completedToday' => ActivityUpdate::whereDate('update_time', $today)
                ->where('status', 'done')
                ->count(),
            'pendingReview' => ActivityUpdate::where('status', 'pending')->count(),
        ];

        $activities = Activity::with(['latestUpdate.user'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'activities' => $activities,
            'teamStats' => $teamStats,
        ]);
    }
}
