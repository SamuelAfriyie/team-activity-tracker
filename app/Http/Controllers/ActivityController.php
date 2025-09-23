<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Inertia\Inertia;


class ActivityController extends Controller
{
    public function index()
    {
       $activities = Activity::with(['latestUpdate.user'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
        ]);
    }

    public function create()
    {
        return Inertia::render('Activities/Create');
    }

    public function show(Activity $activity)
    {
        $activity->load(['updates.user' => function ($query) {
            $query->orderBy('update_time', 'desc');
        }]);

        return Inertia::render('Activities/Show', [
            'activity' => $activity,
        ]);
    }
}
