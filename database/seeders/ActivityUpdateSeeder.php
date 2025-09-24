<?php

namespace Database\Seeders;

use App\Models\ActivityUpdate;
use App\Models\DailyActivity;
use Illuminate\Database\Seeder;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Artisan;

class ActivityUpdateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $date = now()->toDateString();

        
         $exists = DailyActivity::where('activity_date', $date)->exists();

        if (! $exists) {
            Artisan::call('daily:generate', ['--date' => $date]);
            $this->command->info("Daily activities generated for {$date}");
        } else {
            $this->command->warn("Daily activities already exist for {$date}, skipping generation.");
        }

        $user = User::first() ?? User::factory()->create();

        $dailyActivities = DailyActivity::where('activity_date', $date)->get();

        if ($dailyActivities->isEmpty()) {
            $this->command->warn('No daily activities found even after generation.');
            return;
        }

        foreach ($dailyActivities as $daily) {
            // Add between 1–3 updates for each daily activity
            $updatesCount = rand(1, 3);

            for ($i = 0; $i < $updatesCount; $i++) {
                ActivityUpdate::create([
                    'daily_activity_id' => $daily->id,
                    'status' => collect(['pending', 'done'])->random(),
                    'remark' => fake()->sentence(),
                    'user_id' => $user->id,
                    'created_at' => now()->subHours(rand(1, 72)),
                ]);
            }
        }

        $this->command->info('Activity updates seeded successfully.');
    }
}
