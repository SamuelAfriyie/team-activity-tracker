<?php

namespace App\Http\Controllers;

use App\Models\MasterActivity;
use Illuminate\Http\Request;

class MasterActivityController extends Controller
{
    public function index()
    {
        $masters = MasterActivity::orderBy('title')->get();
        return inertia('MasterActivities/Index', ['masters' => $masters]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $master = MasterActivity::create(array_merge($data, ['created_by' =>
        $request->user()->id]));
        // also create today's daily instance so it is immediately visible
        \App\Models\DailyActivity::firstOrCreate([
            'master_activity_id' => $master->id,
            'activity_date' => now()->toDateString(),
        ], ['status' => 'todo']);
        return redirect()->back();
    }

    public function update(Request $request, MasterActivity $masterActivity)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $masterActivity->update($data);

        return redirect()->back();
    }

    public function destroy(MasterActivity $masterActivity)
    {
        $masterActivity->delete();
        return redirect()->back();
    }
}
