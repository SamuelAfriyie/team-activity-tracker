<?php

namespace App\Console\Commands;

use App\Services\DailyActivityService;
use Illuminate\Console\Command;

class GenerateDailyActivities extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'daily:generate {--date=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate daily activities from master activities';

    /**
     * Execute the console command.
     */
    public function handle(DailyActivityService $service)
    {
         $date = $this->option('date') ?: now()->toDateString();

        $service->generate($date);

        $this->info("Daily activities generated for {$date}");
        return 0;
    }
}
