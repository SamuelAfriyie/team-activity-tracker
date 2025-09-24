import React, { useState, useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Checkbox } from '@/Components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  Shield,
  Building,
  Users,
  BarChart3,
  Network,
  Server,
  Clock
} from 'lucide-react'
import { Label } from '@/Components/ui/label'

interface LoginProps {
  systemName: string
  version: string
}

export default function Login({ systemName = 'Activity Tracker Pro', version = 'v2.1.0' }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  useEffect(() => {
    setIsLoading(processing)
  }, [processing])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  const systemFeatures = [
    { icon: BarChart3, label: 'Real-time Analytics', description: 'Live activity monitoring and reporting' },
    { icon: Network, label: 'Activity Tracking', description: 'Comprehensive daily activity logging' },
  ]

  return (
    <div className='min-h-screen'>
      <Head title="Secure Login | Activity Tracker Pro" />

      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Left Side - System Information */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white">
          <div>
            {/* System Header */}
            <div className="flex items-center space-x-3 mb-12">
              <div>
                <h1 className="text-2xl font-bold">{systemName}</h1>
                <p className="text-blue-200 text-sm">Management System</p>
              </div>
            </div>

            {/* System Description */}
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Enterprise Activity Management
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Professional activity tracking and team management system for application support teams.
                Monitor daily activities, track progress, and generate comprehensive reports.
              </p>

              {/* Features Grid */}
              <div className="grid gap-6">
                {systemFeatures.map((feature, index) => (
                  <div key={feature.label} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.label}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div className="flex items-center space-x-4">
              <span>{version}</span>
              <span>•</span>
              <span>Secure Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{new Date().getFullYear()} © Samuel Afriyie</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                
                <div className="text-center">
                  <h1 className="text-xl font-bold text-white">{systemName}</h1>
                  <p className="text-blue-200 text-sm">Management System</p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-2xl">
              <CardHeader className="text-center space-y-4 pb-6">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Activity Tracker Pro
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Enter your corporate credentials
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={submit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Corporate Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.name@company.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="pl-10 border-slate-300 focus:border-blue-500 bg-white"
                        autoComplete="email"
                        autoFocus
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                        Access Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs text-blue-600 hover:text-blue-500 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="pl-10 pr-10 border-slate-300 focus:border-blue-500 bg-white"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={data.remember}
                      onCheckedChange={(checked) => setData('remember', checked === true)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-600">
                      Remember this device
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 shadow-lg shadow-slate-500/25 h-11 text-white/95 "
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2 text-white/95" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Access System
                      </>
                    )}
                  </Button>

                  {/* Support Information */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">
                          Need assistance?
                        </p>
                        <p className="text-xs text-slate-600">
                          Contact your system administrator or IT support team for access issues.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>

                {/* System Status */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>System Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Footer */}
            <div className="lg:hidden mt-6 text-center">
              <p className="text-xs text-slate-400">
                {systemName} {version} • {new Date().getFullYear()} © Samuel Afriyie
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}