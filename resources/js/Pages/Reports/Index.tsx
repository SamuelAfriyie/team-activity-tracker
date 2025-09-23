import React, { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/Components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Badge } from '@/Components/ui/badge'
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react'
import { SharedPageProps } from '@/types/inertia'
import { format, subDays } from 'date-fns'

interface ReportsIndexProps extends SharedPageProps {
  filters: {
    start_date: string
    end_date: string
    report_type: string
    user_id?: string
  }
  stats: {
    total_activities: number
    total_updates: number
    completed_updates: number
    completion_rate: number
    avg_daily_updates: number
  }
  teamPerformance: Array<{
    id: number
    name: string
    position: string
    department: string
    total_updates: number
    completed_updates: number
    completion_rate: number
    avatar: string
  }>
  activityBreakdown: Array<{
    type: string
    title: string
    total_updates: number
    completed_updates: number
    completion_rate: number
  }>
  dailyTrend: Array<{
    date: string
    label: string
    updates: number
    completed: number
    completion_rate: number
  }>
  statusDistribution: {
    done: number
    in_progress: number
    pending: number
  }
  users: Array<{
    id: number
    name: string
    position: string
  }>
}

export default function ReportsIndex({
  auth,
  filters,
  stats,
  teamPerformance,
  activityBreakdown,
  dailyTrend,
  statusDistribution,
  users
}: ReportsIndexProps) {
  const [dateRange, setDateRange] = useState({
    from: new Date(filters.start_date),
    to: new Date(filters.end_date),
  })
  const [reportType, setReportType] = useState(filters.report_type)
  const [selectedUser, setSelectedUser] = useState(filters.user_id || '')

  const { data, setData, processing } = useForm({
    start_date: filters.start_date,
    end_date: filters.end_date,
    report_type: filters.report_type,
    user_id: filters.user_id || '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get('/reports', data, {
      preserveState: true,
      replace: true,
    })
  }

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    if (from && to) {
      setDateRange({ from, to })
      setData({
        ...data,
        start_date: format(from, 'yyyy-MM-dd'),
        end_date: format(to, 'yyyy-MM-dd'),
      })
    }
  }

  const quickFilters = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', days: 0, special: 'month' },
    { label: 'Last Month', days: 0, special: 'last_month' },
  ]

  const applyQuickFilter = (filter: typeof quickFilters[0]) => {
    let from: Date
    let to = new Date()

    if (filter.special === 'month') {
      from = new Date(to.getFullYear(), to.getMonth(), 1)
    } else if (filter.special === 'last_month') {
      from = new Date(to.getFullYear(), to.getMonth() - 1, 1)
      to = new Date(to.getFullYear(), to.getMonth(), 0)
    } else {
      from = subDays(to, filter.days)
    }

    setDateRange({ from, to })
    setData({
      ...data,
      start_date: format(from, 'yyyy-MM-dd'),
      end_date: format(to, 'yyyy-MM-dd'),
    })
  }

  const statsCards = [
    {
      label: 'Total Activities',
      value: stats.total_activities.toLocaleString(),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Updates',
      value: stats.total_updates.toLocaleString(),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Completion Rate',
      value: `${stats.completion_rate}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Avg Daily Updates',
      value: stats.avg_daily_updates.toLocaleString(),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ]

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AppLayout user={auth.user} header="Reports & Analytics">
      <Head title="Reports | Activity Tracker Pro" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-slate-600 mt-2">
              Comprehensive insights into team performance and activity trends
            </p>
          </div>
          <Button
            onClick={() => router.get('/reports', {}, { preserveState: true })}
            variant="outline"
            disabled={processing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${processing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-slate-200 card-hover">
        <CardContent className="pt-6">
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Quick Filters */}
              <div className="md:col-span-2 space-y-2">
                <Label>Quick Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter) => (
                    <Button
                      key={filter.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickFilter(filter)}
                      className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => handleDateChange(range?.from, range?.to)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* User Filter */}
              <div className="space-y-2">
                <Label>Team Member</Label>
                <Select value={selectedUser} onValueChange={(value) => {
                  setSelectedUser(value)
                  setData('user_id', value)
                }}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder="All Team Members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">All Team Members</SelectItem>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Filters */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  disabled={processing}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {processing ? 'Applying...' : 'Apply Filters'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((stat) => (
          <Card key={stat.label} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500">
                {stat.label === 'Completion Rate' ? 'of all updates' : 'across selected period'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Performance */}
        <Card className="border-slate-200 card-hover">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual completion rates and activity volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 overflow-y-auto h-[350px] pr-1">
              {teamPerformance.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">{member.name}</p>
                      <p className="text-xs text-slate-500 truncate">{member.position} • {member.department}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`font-semibold ${getCompletionColor(member.completion_rate)}`}>
                      {member.completion_rate}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {member.completed_updates}/{member.total_updates} completed
                    </div>
                  </div>
                </div>
              ))}

              {teamPerformance.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No activity data for selected period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card className="border-slate-200 card-hover">
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>Performance by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 overflow-y-auto h-[350px] pr-1">
              {activityBreakdown.map((activity) => (
                <div key={activity.type} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 capitalize">{activity.type.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.title}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`font-semibold ${getCompletionColor(activity.completion_rate)}`}>
                      {activity.completion_rate}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {activity.completed_updates}/{activity.total_updates}
                    </div>
                  </div>
                </div>
              ))}

              {activityBreakdown.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No activity data for selected period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections */}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        {/* Daily Trend */}
        <Card className="border-slate-200 card-hover">
          <CardHeader>
            <CardTitle>Daily Completion Trend</CardTitle>
            <CardDescription>Completion rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 overflow-y-auto h-[410px] pr-1">
              {dailyTrend.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 w-16">{day.label}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(day.completion_rate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <span className={`text-sm font-semibold ${getCompletionColor(day.completion_rate)}`}>
                      {day.completion_rate}%
                    </span>
                    <div className="text-xs text-slate-500">{day.updates} updates</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-slate-200 card-hover">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current status of all updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(status)}>
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900">{count}</span>
                    <span className="text-slate-500 text-sm ml-1">
                      ({stats.total_updates > 0 ? Math.round((count / stats.total_updates) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card className="mt-6 border-slate-200 card-hover">
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download comprehensive reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              onClick={() => router.post('/reports/export', data)}
            >
              <Download className="mr-2 h-4 w-4" />
              PDF Report
            </Button>
            <Button
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              onClick={() => router.post('/reports/export', { ...data, format: 'excel' })}
            >
              <Download className="mr-2 h-4 w-4" />
              Excel Spreadsheet
            </Button>
            <Button
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              onClick={() => router.post('/reports/export', { ...data, format: 'csv' })}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}