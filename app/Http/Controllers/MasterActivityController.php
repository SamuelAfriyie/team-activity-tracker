<?php

namespace App\Http\Controllers;

use App\Models\DailyActivity;
use App\Models\MasterActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MasterActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = MasterActivity::with(['latestUpdate.user']);
        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $activities = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $master = MasterActivity::create([
            'title' => $request->title,
            'description' => $request->description,
            'created_by' => Auth::id()
            // 'is_active' => true,
        ]);

        // also create today's daily instance so it is immediately visible
        DailyActivity::firstOrCreate([
            'master_activity_id' => $master->id,
            'activity_date' => now()->toDateString(),
        ], ['status' => 'pending']);
        return redirect()->back();


        return redirect()->back()->with('success', 'Activity created successfully!');
    }

    public function show(MasterActivity $activity)
    {
        $activity->load(['updates.user' => function ($query) {
            $query->orderBy('update_time', 'desc');
        }]);

        return Inertia::render('Activities/Show', [
            'activity' => $activity,
        ]);
    }

    public function update(Request $request, MasterActivity $activity)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $activity->update($request->only(['title', 'description']));

        return redirect()->back()->with('success', 'Activity updated successfully!');
    }

    public function destroy(MasterActivity $activity)
    {
        $activity->update(['is_active' => false]);

        return redirect()->route('activities.index')->with('success', 'Activity deleted successfully!');
    }
}
