<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $activities = [
            [
                'title' => 'Daily SMS Count Comparison',
                'description' => 'Compare daily SMS counts with log files to ensure all messages are processed correctly.',
                'type' => 'sms_count',
                'metrics' => [
                    'expected_count' => 15000,
                    'tolerance_percent' => 5,
                    'source' => 'System Logs vs Database'
                ],
                'is_active' => true,
            ],
            [
                'title' => 'Server Health Monitoring',
                'description' => 'Monitor server performance, CPU usage, memory utilization, and disk space.',
                'type' => 'server_health',
                'metrics' => [
                    'cpu_threshold' => 80,
                    'memory_threshold' => 85,
                    'disk_threshold' => 90
                ],
                'is_active' => true,
            ],
            [
                'title' => 'Database Backup Verification',
                'description' => 'Perform daily database backup and verify integrity of backup files.',
                'type' => 'backup',
                'metrics' => [
                    'backup_size_min' => '500MB',
                    'verification_required' => true,
                    'retention_days' => 30
                ],
                'is_active' => true,
            ],
            [
                'title' => 'Application Error Log Review',
                'description' => 'Review application error logs and track recurring issues for resolution.',
                'type' => 'monitoring',
                'metrics' => [
                    'error_threshold' => 10,
                    'priority_levels' => ['high', 'medium', 'low'],
                    'auto_alert' => true
                ],
                'is_active' => true,
            ],
            [
                'title' => 'API Endpoint Status Check',
                'description' => 'Monitor all critical API endpoints for availability and response times.',
                'type' => 'monitoring',
                'metrics' => [
                    'response_time_threshold' => '2s',
                    'uptime_requirement' => '99.9%',
                    'endpoints_count' => 15
                ],
                'is_active' => true,
            ],
            [
                'title' => 'SMS Gateway Health Check',
                'description' => 'Verify SMS gateway connectivity and message delivery rates.',
                'type' => 'monitoring',
                'metrics' => [
                    'delivery_rate_threshold' => 95,
                    'timeout_threshold' => '30s',
                    'queue_monitoring' => true
                ],
                'is_active' => true,
            ],
            [
                'title' => 'Weekly Performance Report',
                'description' => 'Generate weekly performance report for management review.',
                'type' => 'other',
                'metrics' => [
                    'report_sections' => ['uptime', 'performance', 'issues', 'resolution'],
                    'automated' => true,
                    'recipients' => 5
                ],
                'is_active' => true,
            ],
            [
                'title' => 'Security Patch Verification',
                'description' => 'Verify and apply latest security patches to application servers.',
                'type' => 'maintenance',
                'metrics' => [
                    'patch_level' => 'latest',
                    'testing_required' => true,
                    'maintenance_window' => '02:00-04:00'
                ],
                'is_active' => true,
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }

        $this->command->info('Activities seeded successfully!');
    }
}
