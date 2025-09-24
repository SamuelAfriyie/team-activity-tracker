import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react'
import { SharedPageProps } from '@/types/inertia'
import { Inertia } from '@inertiajs/inertia'
import { route } from '@/lib/route'
import { Dialog, DialogContent } from '@/Components/ui/dialog'

interface Activity {
  id: number
  title: string
  description?: string
  type: string
  is_active: boolean
  created_at: string
  updated_at: string
  latest_update?: {
    status: string
    user: {
      name: string
    }
    update_time: string
  }
}

interface ActivitiesIndexProps extends SharedPageProps {
  activities: Activity[]
  filters: {
    search?: string
    status?: string
    type?: string
  }
}

export default function ActivitiesIndex({ auth, activities, filters }: ActivitiesIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: ''
  })


  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleFilter = () => {
    Inertia.get(route('activities.index'), {
      search: searchTerm
    } as any, {
      preserveState: true,
      replace: true,
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    Inertia.get(route('activities.index'), {}, { preserveState: true, replace: true })
  }

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault()
    Inertia.post(route('activities.store'), newActivity, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        setNewActivity({ title: '', description: '' })
      }
    })
  }

  console.log("Activites; ", filteredActivities);


  return (
    <AppLayout>
      <Head title="Activities" />
      <div className="flex flex-col h-screen">
        {/* 🔹 Top Navbar */}
        <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Master Activities</h1>
        </header>
        {/* Create Activity Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={() => setIsCreateModalOpen(false)}>
          <DialogContent className="max-w-2xl overflow-y-auto">
            <div className="max-w-md w-full">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Activity</h3>

              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Activity Title *</Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    placeholder="Enter activity title"
                    className="border-slate-300 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    placeholder="Enter activity description"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Activity
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
        <main className='p-4'>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
              <div className='flex justify-end w-full'>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className=" bg-blue-600  hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Activity
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="mb-6 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Activities
              </CardTitle>
              <CardDescription>
                Find activities by search term, status, or type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-end gap-2">
                  <Button onClick={handleFilter} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply
                  </Button>
                  <Button onClick={clearFilters} variant="outline" className="flex-1">
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-slate-600">
              Showing {filteredActivities.length} of {activities.length} activities
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid gap-6">
            {filteredActivities?.map((activity) => (
              <Card key={activity.id} className="border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                <CardContent className="px-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-slate-900 text-lg hover:text-blue-600 transition-colors cursor-pointer">
                          <Link href={`/activities/${activity.id}`}>
                            {activity.title}
                          </Link>
                        </h3>
                      </div>

                      {activity.description && (
                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/activities/${activity.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Activity Meta */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created: {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Last updated: {new Date(activity.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant={activity.is_active ? 'default' : 'secondary'}>
                      {activity.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredActivities.length === 0 && (
              <Card className="text-center py-12 border-slate-200">
                <CardContent>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No activities found</h3>
                  <p className="text-slate-500 mb-4">
                    {searchTerm
                      ? 'Try adjusting your filters or search criteria'
                      : 'Get started by creating your first activity'
                    }
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Activity
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AppLayout>
  )
}