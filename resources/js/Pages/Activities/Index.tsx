import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Input } from '@/Components/ui/input'
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    Clock,
    PlayCircle,
    BarChart3,
    Server,
    Database,
    Eye
} from 'lucide-react'
import { Activity, ActivityUpdate } from '@/types/inertia'
import { SharedPageProps } from '@/types/inertia'

interface ActivitiesIndexProps extends SharedPageProps {
    activities: (Activity & { latest_update?: ActivityUpdate })[]
}

export default function ActivitiesIndex({ auth, activities }: ActivitiesIndexProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done' | 'in_progress'>('all')

    const filteredActivities = activities?.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' ||
            activity.latest_update?.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'done': return 'status-done text-white'
            case 'in_progress': return 'status-in-progress text-white'
            default: return 'status-pending text-white'
        }
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'sms_count': return <BarChart3 className="h-5 w-5 text-blue-500" />
            case 'server_health': return <Server className="h-5 w-5 text-green-500" />
            case 'backup': return <Database className="h-5 w-5 text-purple-500" />
            default: return <BarChart3 className="h-5 w-5 text-gray-500" />
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done': return <CheckCircle className="h-4 w-4" />
            case 'in_progress': return <PlayCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <AppLayout user={auth.user} header="Activities Management">
            <Head title="Activities" />

            {/* Header with Actions */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                            Team Activities
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage and track your team's daily activities
                        </p>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500">
                        <Link href="/activities/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Activity
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6 card-hover">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('all')}
                                className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('pending')}
                                className="bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('in_progress')}
                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                            >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                In Progress
                            </Button>
                            <Button
                                variant={statusFilter === 'done' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('done')}
                                className="bg-success-50 text-success-700 border-success-200 hover:bg-success-100"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Done
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activities Grid */}
            <div className="grid gap-6">
                {filteredActivities?.map((activity) => (
                    <Card key={activity.id} className="card-hover group">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="p-2 bg-primary-50 rounded-lg">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary-600 transition-colors">
                                                {activity.title}
                                            </h3>
                                            <Badge variant="outline" className="bg-secondary-50">
                                                {activity.type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-3 line-clamp-2">
                                            {activity.description || 'No description provided'}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {activity.latest_update && (
                                                <>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(activity.latest_update.status)}
                                                        <Badge className={getStatusVariant(activity.latest_update.status)}>
                                                            {activity.latest_update.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <span>by {activity.latest_update.user?.name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(activity.latest_update.update_time).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/activities/${activity.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredActivities?.length === 0 && (
                <Card className="text-center py-12 card-hover">
                    <CardContent>
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first activity'
                            }
                        </p>
                        <Button asChild className="bg-gradient-to-r from-primary-500 to-primary-400">
                            <Link href="/activities/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Activity
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    )
}