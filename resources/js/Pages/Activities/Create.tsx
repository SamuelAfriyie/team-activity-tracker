import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { SharedPageProps } from '@/types/inertia' 

export default function ActivityCreate({ auth }: SharedPageProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    type: 'sms_count',
    metrics: {},
  })

  const activityTypes = [
    { value: 'sms_count', label: 'SMS Count Comparison', description: 'Compare daily SMS counts with log data' },
    { value: 'server_health', label: 'Server Health Check', description: 'Monitor server performance and health' },
    { Value: 'backup', label: 'Database Backup', description: 'Perform and verify database backups' },
    { value: 'monitoring', label: 'System Monitoring', description: 'General system monitoring tasks' },
    { value: 'other', label: 'Other Activity', description: 'Custom activity type' },
  ]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/activities')
  }

  return (
    <AppLayout user={auth.user} header="Create Activity">
      <Head title="Create Activity" />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/activities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Create New Activity
            </h1>
            <p className="text-muted-foreground">
              Add a new activity for your team to track
            </p>
          </div>
        </div>

        <form onSubmit={submit}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-xl">Activity Details</CardTitle>
              <CardDescription>
                Enter the basic information for this activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Activity Title *
                </Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="e.g., Daily SMS Count Comparison"
                  className="border-primary-200 focus:border-primary-300"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Activity Type *
                </Label>
                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                  <SelectTrigger className="border-primary-200 focus:border-primary-300">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes?.map((type) => (
                      <SelectItem key={type.value} value={type.value!}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Describe what this activity involves..."
                  rows={4}
                  className="border-primary-200 focus:border-primary-300 resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Metrics (dynamic based on type) */}
              {data.type === 'sms_count' && (
                <div className="space-y-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h4 className="font-medium text-primary-900">SMS Count Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected_count" className="text-sm">
                        Expected Count
                      </Label>
                      <Input
                        id="expected_count"
                        type="number"
                        placeholder="0"
                        className="border-primary-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tolerance" className="text-sm">
                        Tolerance (%)
                      </Label>
                      <Input
                        id="tolerance"
                        type="number"
                        placeholder="5"
                        className="border-primary-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Creating...' : 'Create Activity'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/activities">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppLayout>
  )
}