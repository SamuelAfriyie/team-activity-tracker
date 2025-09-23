<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
     public function index(Request $request)
    {
        
        // Get filter parameters with defaults
        $startDate = $request->input('start_date', Carbon::now()->subDays(7)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $reportType = $request->input('report_type', 'weekly');
        $userId = $request->input('user_id');

        // Convert to Carbon instances
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate)->endOfDay();

        // Base query for activity updates within date range
        $updatesQuery = ActivityUpdate::with(['activity', 'user'])
            ->whereBetween('update_time', [$start, $end]);

        // Filter by user if specified
        if ($userId) {
            $updatesQuery->where('user_id', $userId);
        }

        $updates = $updatesQuery->get();

        // Calculate statistics
        $totalActivities = Activity::where('is_active', true)->count();
        $totalUpdates = $updates->count();
        $completedUpdates = $updates->where('status', 'done')->count();
        $completionRate = $totalUpdates > 0 ? round(($completedUpdates / $totalUpdates) * 100, 2) : 0;

        // Team performance
        $teamPerformance = User::where('is_active', true)
            ->withCount(['activityUpdates as total_updates' => function ($query) use ($start, $end) {
                $query->whereBetween('update_time', [$start, $end]);
            }])
            ->withCount(['activityUpdates as completed_updates' => function ($query) use ($start, $end) {
                $query->where('status', 'done')->whereBetween('update_time', [$start, $end]);
            }])
            ->get()
            ->map(function ($user) {
                $completionRate = $user->total_updates > 0 
                    ? round(($user->completed_updates / $user->total_updates) * 100, 2) 
                    : 0;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'position' => $user->position,
                    'department' => $user->department,
                    'total_updates' => $user->total_updates,
                    'completed_updates' => $user->completed_updates,
                    'completion_rate' => $completionRate,
                    'avatar' => strtoupper(substr($user->name, 0, 2)),
                ];
            })
            ->sortByDesc('completion_rate')
            ->values();

        // Activity type breakdown
        $activityBreakdown = Activity::with(['updates' => function ($query) use ($start, $end) {
            $query->whereBetween('update_time', [$start, $end]);
        }])
        ->where('is_active', true)
        ->get()
        ->map(function ($activity) {
            $totalUpdates = $activity->updates->count();
            $completedUpdates = $activity->updates->where('status', 'done')->count();
            $completionRate = $totalUpdates > 0 ? round(($completedUpdates / $totalUpdates) * 100, 2) : 0;

            return [
                'type' => $activity->type,
                'title' => $activity->title,
                'total_updates' => $totalUpdates,
                'completed_updates' => $completedUpdates,
                'completion_rate' => $completionRate,
            ];
        })
        ->sortByDesc('total_updates')
        ->values();

        // Daily completion trend
        $dailyTrend = [];
        $currentDate = $start->copy();
        
        while ($currentDate <= $end) {
            $dayStart = $currentDate->copy()->startOfDay();
            $dayEnd = $currentDate->copy()->endOfDay();

            $dayUpdates = ActivityUpdate::whereBetween('update_time', [$dayStart, $dayEnd])->count();
            $dayCompleted = ActivityUpdate::where('status', 'done')
                ->whereBetween('update_time', [$dayStart, $dayEnd])
                ->count();

            $dayRate = $dayUpdates > 0 ? round(($dayCompleted / $dayUpdates) * 100, 2) : 0;

            $dailyTrend[] = [
                'date' => $currentDate->format('Y-m-d'),
                'label' => $currentDate->format('M j'),
                'updates' => $dayUpdates,
                'completed' => $dayCompleted,
                'completion_rate' => $dayRate,
            ];

            $currentDate->addDay();
        }

        // Status distribution
        $statusDistribution = [
            'done' => $updates->where('status', 'done')->count(),
            'in_progress' => $updates->where('status', 'in_progress')->count(),
            'pending' => $updates->where('status', 'pending')->count(),
        ];

        return Inertia::render('Reports/Index', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'report_type' => $reportType,
                'user_id' => $userId,
            ],
            'stats' => [
                'total_activities' => $totalActivities,
                'total_updates' => $totalUpdates,
                'completed_updates' => $completedUpdates,
                'completion_rate' => $completionRate,
                'avg_daily_updates' => count($dailyTrend) > 0 ? round($totalUpdates / count($dailyTrend), 1) : 0,
            ],
            'teamPerformance' => $teamPerformance,
            'activityBreakdown' => $activityBreakdown,
            'dailyTrend' => $dailyTrend,
            'statusDistribution' => $statusDistribution,
            'users' => User::where('is_active', true)->get(['id', 'name', 'position']),
        ]);
    }


    public function export(Request $request)
    {
        // Basic export functionality - you can expand this with CSV/PDF generation
        $filters = $request->only(['start_date', 'end_date', 'report_type', 'user_id']);
        
        return response()->json([
            'message' => 'Export functionality would be implemented here',
            'filters' => $filters,
            'exported_at' => now()->toDateTimeString(),
        ]);
    }
}
