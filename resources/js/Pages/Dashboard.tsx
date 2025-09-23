import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { 
  Activity, 
  Users, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  LogOut,
  Shield,
  Building,
  BarChart3
} from 'lucide-react'
import { SharedPageProps } from '@/types/inertia'

interface DashboardProps extends SharedPageProps {
  activities: Array<{
    id: number
    title: string
    type: string
    latest_update?: {
      status: string
      user: {
        name: string
      }
      update_time: string
    }
  }>
  teamStats: {
    totalActivities: number
    teamMembers: number
    completedToday: number
    pendingReview: number
  }
}

export default function Dashboard({ auth, activities, teamStats }: DashboardProps) {
  const systemStats = [
    { 
      label: 'Active Activities', 
      value: teamStats.totalActivities.toString(), 
      change: '+12%', 
      icon: Activity, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Team Members', 
      value: teamStats.teamMembers.toString(), 
      change: 'Online', 
      icon: Users, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'online'
    },
    { 
      label: 'Completed Today', 
      value: teamStats.completedToday.toString(), 
      change: '+5', 
      icon: CheckCircle, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Pending Review', 
      value: teamStats.pendingReview.toString(), 
      change: '-2', 
      icon: Clock, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'done': 'bg-emerald-100 text-emerald-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-amber-100 text-amber-800'
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-slate-100 text-slate-800'
    }
    return variants[priority as keyof typeof variants] || variants.low
  }

  return (
    <AppLayout user={auth.user} header="Dashboard">
      <Head title="Dashboard | Activity Tracker Pro" />

      {/* Welcome Header */}
      <Card className="mb-8 border-slate-200 card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Welcome back, {auth.user.name}
                </h2>
                <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{auth.user.department}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>{auth.user.position}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last access: {new Date(auth.user.last_login_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {auth.user.is_admin && (
                <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  System Administrator
                </Badge>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/logout" method="post">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 hover:border-slate-300 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className={`text-xs ${stat.status === 'online' ? 'text-green-600' : 'text-slate-500'}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-slate-700" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest team activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      {activity.latest_update ? (
                        <>
                          <span>by {activity.latest_update.user.name}</span>
                          <span>•</span>
                          <span>{new Date(activity.latest_update.update_time).toLocaleDateString()}</span>
                        </>
                      ) : (
                        <span>No updates yet</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {activity.latest_update && (
                      <Badge className={getStatusBadge(activity.latest_update.status)}>
                        {activity.latest_update.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/activities">
                  View All Activities
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200 card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used system functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-11" asChild>
                <Link href="/activities">
                  <Activity className="mr-2 h-4 w-4" />
                  View All Activities
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-11">
                <Users className="mr-2 h-4 w-4" />
                Team Management
              </Button>
              <Button variant="outline" className="w-full justify-start h-11">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
              {auth.user.is_admin && (
                <Button variant="outline" className="w-full justify-start h-11">
                  <Shield className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}