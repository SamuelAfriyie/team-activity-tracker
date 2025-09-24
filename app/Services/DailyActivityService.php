<?php

namespace App\Services;

use App\Models\DailyActivity;
use App\Models\MasterActivity;

class DailyActivityService
{
    /**
     * Generate daily activities for a given date
     */
    public function generate(string $date): void
    {
        $masters = MasterActivity::all();

        foreach ($masters as $idx => $m) {
            DailyActivity::firstOrCreate(
                [
                    'master_activity_id' => $m->id,
                    'activity_date' => $date,
                ],
                [
                    'status' => 'todo',
                    'position' => $idx,
                ]
            );
        }
    }
}
