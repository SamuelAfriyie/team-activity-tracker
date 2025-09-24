<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teamMembers = [
            [
                'name' => 'Admin User',
                'email' => 'admin@company.com',
                'password' => Hash::make('password'),
                'position' => 'System Administrator',
                'department' => 'IT Support',
                'is_active' => true,
            ],
            [
                'name' => 'John Smith',
                'email' => 'john.smith@company.com',
                'password' => Hash::make('password'),
                'position' => 'Application Support Lead',
                'department' => 'Application Support',
                'is_active' => true,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@company.com',
                'password' => Hash::make('password'),
                'position' => 'Senior Support Engineer',
                'department' => 'Application Support',
                'is_active' => true,
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike.chen@company.com',
                'password' => Hash::make('password'),
                'position' => 'Support Engineer',
                'department' => 'Application Support',
                'is_active' => true,
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@company.com',
                'password' => Hash::make('password'),
                'position' => 'Support Engineer',
                'department' => 'Application Support',
                'is_active' => true,
            ],
            [
                'name' => 'Robert Wilson',
                'email' => 'robert.wilson@company.com',
                'password' => Hash::make('password'),
                'position' => 'Database Administrator',
                'department' => 'Infrastructure',
                'is_active' => true,
            ],
        ];

        foreach ($teamMembers as $userData) {
            User::create($userData);
        }

        $this->command->info('Team members seeded successfully!');
        $this->command->info('Default login: admin@company.com / password');
    }
}
