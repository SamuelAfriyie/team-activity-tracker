# Team Activity Tracker - Management System

A modern, professional activity tracking system built with Laravel, React, Inertia.js, and Tailwind CSS. Designed for application support teams to track daily activities, monitor progress, and generate comprehensive reports.

## Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Activity Management**: Create, track, and manage team activities
- **Real-time Updates**: Track activity status changes and remarks
- **Team Collaboration**: Multiple team members with role-based access
- **Advanced Reporting**: Comprehensive analytics and export capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional Authentication**: Enterprise-style login system

## Tech Stack

- **Backend**: Laravel 10.x
- **Frontend**: React 18, TypeScript, Inertia.js
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite (development), MySQL/PostgreSQL (production ready)
- **Authentication**: Laravel Sanctum
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have the following installed:
- PHP 8.1 or higher
- Composer
- Node.js 16 or higher
- npm or yarn

## 🏁 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SamuelAfriyie/team-activity-tracker.git
cd team-activity-tracker
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the environment file and generate application key:

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure Database

Update your `.env` file with database configuration. For development with SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/database/database.sqlite
```

**Create the SQLite database file:**

```bash
# Create the database file
touch database/database.sqlite

# Verify the file was created
ls -la database/database.sqlite
```

> **Note**: Make sure the path in your `.env` file matches the actual path to your `database.sqlite` file. You can use the absolute path for better reliability.

### 6. Run Migrations

Create the database tables:

```bash
php artisan migrate
```

### 7. Seed the Database

Populate the database with sample data including users and activities:

```bash
php artisan db:seed
```

Or run specific seeders:

```bash
# Seed users only
php artisan db:seed --class=UserSeeder

# Seed activities only
php artisan db:seed --class=MasterActivitySeeder

# Seed activity updates only
php artisan db:seed --class=ActivityUpdateSeeder
```

### 8. Build Frontend Assets

Build the React application:

```bash
# Production build
npm run build

# Or for development with hot reloading
npm run dev
```

### 9. Start the Development Servers

You need to run two servers simultaneously:

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite Frontend (for development):**
```bash
npm run dev
```

### 10. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## Default Login Credentials

After seeding the database, you can login with these credentials:

**Admin Account:**
- **Email**: `admin@company.com`
- **Password**: `password`

**Team Member Accounts:**
- **Email**: `john.smith@company.com` / `sarah.johnson@company.com` / etc.
- **Password**: `password`

## Sample Data Included

The database seeder creates:

### 👥 Team Members (6 Users)
- System Administrator
- Application Support Lead
- Senior Support Engineers
- Support Engineers
- Database Administrator

### Master Activities (8 Activities)
- Daily SMS Count Comparison
- Server Health Monitoring
- Database Backup Verification
- Application Error Log Review
- API Endpoint Status Check
- SMS Gateway Health Check
- Weekly Performance Report
- Security Patch Verification

### Activity Updates
- Updates for the last 7 days
- Realistic status changes (Pending, In Progress, Done)
- Team member assignments
- Professional remarks and timestamps

## Project Structure

```
team-activity-tracker/
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   ├── Models/              # Eloquent models
│   └── ...
├── database/
│   ├── seeders/            # Database seeders
│   └── migrations/         # Database migrations
├── resources/
│   ├── js/
│   │   ├── Pages/          # React page components
│   │   ├── Layouts/        # Application layouts
│   │   └── Components/     # Reusable UI components
│   └── views/              # Blade templates
└── ...
```

## Key Pages & Features

### Dashboard (`/dashboard`)
- Activity statistics and overview
- Recent team activities
- Quick action buttons

### Activities Management (`/activities`)
- View all master activities
- Advanced filtering and search
- Create new activities via modal
- Status tracking and updates

### Reports & Analytics (`/reports`)
- Comprehensive activity reports
- Team performance metrics
- Date range filtering
- Export capabilities

## Production Deployment

### 1. Environment Configuration

Update `.env` for production:

```env
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 2. Optimize Application

```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build frontend assets
npm run build
```

### 3. Set Up Web Server

Configure your web server (Apache/Nginx) to point to the `public` directory.

## 🔧 Development Commands

### Common Artisan Commands
```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migration with seed
php artisan migrate:fresh --seed

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate IDE helpers
php artisan ide-helper:generate
```

### Frontend Development
```bash
# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Common Issues

**SQLite Database Not Found:**
```bash
# Ensure the database file exists and has proper permissions
touch database/database.sqlite
chmod 755 database/database.sqlite
```

**Migration Errors:**
```bash
# Reset the database
php artisan migrate:fresh

# Or reset with seed data
php artisan migrate:fresh --seed
```

**Frontend Build Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild assets
npm run build
```

**Permission Issues:**
```bash
# Set proper permissions
chmod -R 755 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

## Monitoring & Logs

### View Application Logs
```bash
tail -f storage/logs/laravel.log
```

### Check Queue Workers (if using queues)
```bash
php artisan queue:work
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the Laravel documentation: https://laravel.com/docs
3. Check the Inertia.js documentation: https://inertiajs.com
4. Open an issue on the GitHub repository

## Success!

If you've followed all steps correctly, you should now have a fully functional Team Activity Tracker system running. You can login with the default credentials and start exploring the features!

**Default Login:**
- **URL**: http://localhost:8000
- **Email**: `admin@company.com`
- **Password**: `password`

Happy tracking! 🚀