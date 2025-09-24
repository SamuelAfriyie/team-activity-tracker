import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import {
  Filter,
  Search,
  Download,
  User,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  PlayCircle,
  MoreVertical,
  Eye,
  CalendarIcon,
  Calendar as CalenderIconBox
} from "lucide-react";
import { SharedPageProps } from '@/types/inertia';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";

interface ReportData {
  id: number;
  activity_date: string;
  status: string;
  master?: {
    title: string;
  };
  updates: Array<{
    user?: {
      name: string;
    };
    remark: string;
    created_at: string;
  }>;
}

interface ReportsProps extends SharedPageProps {
  results: ReportData[];
  users: Array<{ id: number; name: string; email: string }>;
  filters: {
    from?: string;
    to?: string;
    user_id?: string;
    status?: string;
  };
}

export default function Reports({ auth, results, users, filters }: ReportsProps) {
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [userId, setUserId] = useState(filters.user_id || "");
  const [status, setStatus] = useState(filters.status || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/reports', { from, to, user_id: userId, status }, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setFrom(new Date());
    setTo(new Date());
    setUserId("");
    setStatus("");
    router.get('/reports', {}, { preserveState: true, replace: true });
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredResults = results.filter(result =>
    result.master?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.updates.some(update =>
      update.remark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleFromDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setFrom(newDate);
    }
  };

  const handleToDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setTo(newDate);
    }
  };
  // Calculate statistics
  const totalActivities = results.length;
  const completedActivities = results.filter(r => r.status?.toLowerCase() === 'done').length;
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  const pendingActivities = results.filter(r => r.status?.toLowerCase() === 'pending').length;

  const stats = [
    { label: 'Total Activities', value: totalActivities, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Completed', value: completedActivities, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Pending', value: pendingActivities, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Active Personnel', value: users?.length ?? 0, color: 'text-slate-600', bgColor: 'bg-slate-50' },
  ];

  return (
    <AppLayout >
      <div className="flex flex-col h-screen">
        {/* 🔹 Top Navbar */}
        <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold"> Activity Reports</h1>
          <Head title="Reports | Activity Tracker" />
        </header>
        {/* Header Section */}
        <main className="p-4">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                      {stat.label === 'Completed' && (
                        <p className="text-xs text-slate-500 mt-1">{completionRate}% completion rate</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <BarChart3 className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters Section */}
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Reports
              </CardTitle>
              <CardDescription>
                Narrow down activities by date range, team member, or status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFilter} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Date From */}
                  <div className="space-y-2">
                    <Label htmlFor="from" className="text-sm font-medium">From Date</Label>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(from ?? new Date(), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={from}
                            onSelect={(date) => handleFromDateSelect(date)}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Date To */}
                  <div className="space-y-2">
                    <Label htmlFor="to" className="text-sm font-medium">To Date</Label>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(to ?? new Date(), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={to}
                            onSelect={(date) => handleToDateSelect(date)}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* User Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="user" className="text-sm font-medium">Team Member</Label>
                    <Select value={userId} onValueChange={setUserId}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-50 w-full">
                        <SelectValue placeholder="All team members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-">All team members</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-500 w-full">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-">All statuses</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="search"
                        type="text"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <div className="flex-1"></div>
                  <Button variant="outline" className="text-slate-600">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Activity Report</CardTitle>
              <CardDescription>
                {filteredResults.length} activities found
                {from && to && ` between ${new Date(from).toLocaleDateString()} and ${new Date(to).toLocaleDateString()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No activities found</h3>
                  <p className="text-slate-500">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <Card key={result.id} className="border-slate-100 hover:border-slate-300 transition-colors">
                      <CardContent className="px-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-slate-900 text-lg">
                                {result.master?.title || 'Untitled Activity'}
                              </h3>
                              <Badge variant="outline" className={getStatusVariant(result.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(result.status)}
                                  {result.status?.replace('_', ' ') || 'Unknown'}
                                </span>
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <CalenderIconBox className="h-4 w-4 text-slate-400" />
                                <span>{new Date(result.activity_date).toLocaleDateString()}</span>
                              </div>

                              {result.updates.length > 0 && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <span>{result.updates[result.updates.length - 1].user?.name || 'Unknown'}</span>
                                  </div>
                                  <div className="text-slate-500">
                                    Last update: {new Date(result.updates[result.updates.length - 1].created_at).toLocaleDateString()}
                                  </div>
                                </>
                              )}
                            </div>

                            {result.updates.length > 0 && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700">
                                  {result.updates[result.updates.length - 1].remark}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  by {result.updates[result.updates.length - 1].user?.name} •
                                  {new Date(result.updates[result.updates.length - 1].created_at).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="ghost" size="sm" className="text-slate-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-600">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Update History */}
                        {result.updates.length > 1 && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-sm font-medium text-slate-700 mb-2">Update History</p>
                            <div className="space-y-2">
                              {result.updates.slice(0, 3).map((update, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm">
                                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                  <span className="text-slate-600">{update.remark}</span>
                                  <span className="text-slate-400 text-xs">
                                    {new Date(update.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                              {result.updates.length > 3 && (
                                <p className="text-xs text-slate-500 mt-1">
                                  +{result.updates.length - 3} more updates
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination or Summary */}
          {filteredResults.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
              <div>
                Showing {filteredResults.length} of {results.length} activities
              </div>
              <div className="flex items-center gap-4">
                <span>Completion Rate: <strong>{completionRate}%</strong></span>
                <span>Pending: <strong>{pendingActivities}</strong></span>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}