import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  History, 
  BarChart3,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react'
import { Activity, ActivityUpdate } from '@/types/inertia'
import { SharedPageProps } from '@/types/inertia'

interface ActivityShowProps extends SharedPageProps {
  activity: Activity & {
    updates: ActivityUpdate[]
  }
}

export default function ActivityShow({ auth, activity }: ActivityShowProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'done': return 'status-done text-white'
      case 'in_progress': return 'status-in-progress text-white'
      default: return 'status-pending text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <BarChart3 className="h-4 w-4" />
      case 'in_progress': return <History className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <AppLayout user={auth.user} header="Activity Details">
      <Head title={activity.title} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/activities">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                {activity.title}
              </h1>
              <p className="text-muted-foreground">
                Track and manage this activity
              </p>
            </div>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary-500 to-primary-400">
            <Link href={`/activities/${activity.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Activity
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Activity Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Activity Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="font-medium capitalize">{activity.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(activity.latest_update?.status || 'pending')}
                      <Badge className={getStatusVariant(activity.latest_update?.status || 'pending')}>
                        {activity.latest_update?.status?.replace('_', ' ') || 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {activity.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-foreground">{activity.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-foreground">
                      {new Date(activity.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Activity Status */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
                <CardDescription>
                  Record the current status of this activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status update form would go here */}
                  <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-400">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Status Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Updates */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.updates.slice(0, 5).map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary-50">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{update.user?.name}</span>
                        <Badge variant="outline" className={getStatusVariant(update.status)}>
                          {update.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(update.update_time).toLocaleString()}
                      </p>
                      {update.remarks && (
                        <p className="text-sm text-foreground">{update.remarks}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {activity.updates.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No updates yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/activities/${activity.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Activity
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <History className="mr-2 h-4 w-4" />
                  View Full History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}