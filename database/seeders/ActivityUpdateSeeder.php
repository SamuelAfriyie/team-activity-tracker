<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ActivityUpdateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $users = User::all();
        $activities = Activity::all();

        if ($users->isEmpty() || $activities->isEmpty()) {
            $this->command->error('Please seed users and activities first!');
            return;
        }

        $statuses = ['pending', 'done'];
        $remarks = [
            'All systems operational',
            'Minor issues detected, monitoring closely',
            'Completed successfully',
            'Pending review from team lead',
            'Awaiting client confirmation',
            'Escalated to development team',
            'Resolved and verified',
            'Scheduled for maintenance',
            'Performance within expected parameters',
            'Backup completed successfully'
        ];

        // Create updates for the last 7 days
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);

            foreach ($activities as $activity) {
                // Create 1-3 updates per activity per day
                $updatesCount = rand(1, 3);

                for ($j = 0; $j < $updatesCount; $j++) {
                    $updateTime = $date->copy()->setTime(
                        rand(8, 17), // Between 8 AM and 5 PM
                        rand(0, 59),
                        rand(0, 59)
                    );

                    $status = $statuses[array_rand($statuses)];
                    $user = $users->random();

                    ActivityUpdate::create([
                        'activity_id' => $activity->id,
                        'user_id' => $user->id,
                        'status' => $status,
                        'remarks' => $remarks[array_rand($remarks)],
                        'update_time' => $updateTime,
                        'created_at' => $updateTime,
                        'updated_at' => $updateTime,
                    ]);
                }
            }
        }

        $this->command->info('Activity updates seeded successfully!');
        $this->command->info('Generated updates for the last 7 days.');
    }
}
