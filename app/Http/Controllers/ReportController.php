<?php

namespace App\Http\Controllers;

use App\Models\DailyActivity;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
     public function index(Request $request)
    {
        $data = $request->validate([
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'user_id' => 'nullable|integer|exists:users,id',
            'status' => 'nullable|in:pending,done',
        ]);

        $from = $data['from'] ?? now()->subDays(7)->toDateString();
        $to = $data['to'] ?? now()->toDateString();

        $query = DailyActivity::with(['master','updates.user'])
            ->whereBetween('activity_date', [$from, $to]);

        if (!empty($data['user_id'])) {
            $query->whereHas('updates', function($q) use ($data) {
                $q->where('user_id', $data['user_id']);
            });
        }

        if (!empty($data['status'])) {
            $query->where('status', $data['status']);
        }

        $results = $query->orderBy('activity_date','desc')->get();

        $users = User::orderBy('name')->get();

        return Inertia::render('Reports/Index', [
            'results' => $results,
            'users' => $users,
            'filters' => $data,
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
