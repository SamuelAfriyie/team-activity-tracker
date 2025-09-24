<?php

namespace App\Http\Controllers;

use App\Models\ActivityUpdate;
use App\Models\DailyActivity;
use Illuminate\Http\Request;

class DailyActivityController extends Controller
{
    public function show(DailyActivity $dailyActivity)
    {
        $dailyActivity->load(['master', 'updates.user']);
        return inertia('DailyActivities/Show', ['activity' => $dailyActivity]);
    }

    public function update(Request $request, DailyActivity $dailyActivity)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,done',
            'remark' => 'nullable|string',
        ]);
        // create an update record
        $update = ActivityUpdate::create([
            'daily_activity_id' => $dailyActivity->id,
            'user_id' => $request->user()->id,
            'status' => $data['status'],
            'remark' => $data['remark'] ?? null,
        ]);
        // update latest state on daily_activity
        $dailyActivity->update([
            'status' => $data['status'],
            'remark' => $data['remark'] ?? $dailyActivity->remark,
        ]);
        return response()->json(['success' => true, 'update' => $update]);
    }

    // Bulk order/status update from drag-and-drop
    public function reorder(Request $request)
    {
        $data = $request->validate([
            'columns' => 'required|array',
            'date' => 'nullable|date',
        ]);

        $date = $data['date'] ?? now()->toDateString();

        foreach ($data['columns'] as $status => $orderedIds) {
            foreach ($orderedIds as $pos => $id) {
                $daily = DailyActivity::where('id', $id)->where('activity_date', $date)->first();
                if ($daily) {
                    $daily->update(['status' => $status, 'position' => $pos]);
                }
            }
        }

        return response()->json(['success' => true]);
    }
}
