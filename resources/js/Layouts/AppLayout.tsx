import { Link, usePage } from '@inertiajs/react'
import { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileClock,
  LogOut,
  ClipboardList,
} from 'lucide-react'
import { route } from '@/lib/route'

const sidebarItems = [
  { name: 'Dashboard', route: 'dashboard', icon: LayoutDashboard },
  { name: 'Activities', route: 'activities.index', icon: ClipboardList },
  { name: 'Reports', route: 'reports.index', icon: FileClock },
]

export default function AppLayout({ children }: PropsWithChildren) {
  const { url } = usePage()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 text-xl font-bold">Activity Tracker Pro</div> 
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.route}
              href={route(item.route)}
              className={cn(
                'flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 mx-2 rounded-sm',
                item.route === 'dashboard'
                  ? url === '/'
                    ? 'bg-muted font-semibold text-blue-600'
                    : ''
                  : url.startsWith(`/${item.route.split('.')[0]}`)
                    ? 'bg-muted font-semibold text-blue-600'
                    : ''
              )}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
