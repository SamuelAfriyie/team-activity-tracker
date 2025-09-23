import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/Components/ui/dropdown-menu'
import { 
  Bell, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  User 
} from 'lucide-react'
import { User as UserType } from '@/types/inertia'

interface AppLayoutProps {
  children: React.ReactNode
  user?: UserType
  header?: string
}

export default function AppLayout({ children, user, header }: AppLayoutProps) {
  return (
    <>
      <Head>
        <title>Team Activity Tracker</title>
      </Head>

      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-1 min-h-0 border-r bg-background">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/" className="text-2xl font-bold text-foreground">
                  ActivityTracker
                </Link>
              </div>
              <nav className="mt-8 flex-1 px-4 space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-accent"
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/activities"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-accent"
                >
                  <Users className="mr-3 h-5 w-5" />
                  Activities
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-accent"
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Reports
                </Link>
              </nav>
            </div>
            <div className="flex flex-shrink-0 p-4 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/logout" method="post">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Header */}
          <header className="shrink-0 border-b">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {header}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}