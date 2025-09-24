<?php

namespace Database\Seeders;

use App\Models\MasterActivity;
use App\Models\User;
use Illuminate\Database\Seeder;

class MasterActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Try to fetch a user (first or last)
        $user = User::query()->orderBy('id', 'asc')->first();
            //   ?? User::query()->orderBy('id', 'desc')->first();

        if (!$user) {
            $this->command->error('No users found. Please seed users first.');
            return;
        }

        $activities = [
            [
                'title' => 'Daily SMS count',
                'description' => 'Compare SMS count in system against SMS count from logs',
                'created_by' => $user->id,
            ],
            [
                'title' => 'System error log check',
                'description' => 'Review system error logs for anomalies or failures',
                'created_by' => $user->id,
            ],
            [
                'title' => 'Database backup verification',
                'description' => 'Ensure latest database backups are complete and valid',
                'created_by' => $user->id,
            ],
            [
                'title' => 'API monitoring',
                'description' => 'Monitor API latency, uptime, and error response codes',
                'created_by' => $user->id,
            ],
            [
                'title' => 'Support tickets review',
                'description' => 'Check pending support tickets and assign priorities',
                'created_by' => $user->id,
            ],
        ];

        foreach ($activities as $activity) {
            MasterActivity::firstOrCreate(
                ['title' => $activity['title']],
                $activity
            );
        }

        $this->command->info('Master activities seeded using user ID: '.$user->id);
    }
}
