import React from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Activity, Users, CheckCircle, Clock } from 'lucide-react'
import { SharedPageProps } from '@/types/inertia'

export default function Dashboard({ auth }: SharedPageProps) {
  const stats = [
    { label: 'Total Activities', value: '24', icon: Activity, change: '+12%' },
    { label: 'Team Members', value: '8', icon: Users, change: '+2' },
    { label: 'Completed Today', value: '18', icon: CheckCircle, change: '+5' },
    { label: 'Pending', value: '6', icon: Clock, change: '-2' },
  ]

  const recentActivities = [
    { id: 1, title: 'SMS Count Comparison', user: 'John Doe', time: '2 hours ago', status: 'done' },
    { id: 2, title: 'Server Health Check', user: 'Jane Smith', time: '4 hours ago', status: 'pending' },
    { id: 3, title: 'Database Backup', user: 'Mike Johnson', time: '6 hours ago', status: 'done' },
  ]

  return (
    <AppLayout user={auth.user} header="Dashboard">
      <Head title="Dashboard" />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Badge variant={activity.status === 'done' ? 'default' : 'secondary'}>
                    {activity.status === 'done' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                Add New Activity
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Team Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Activities Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}