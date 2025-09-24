import { Auth, PageProps } from '@inertiajs/core'

export interface User {
    id: number
    name: string
    email: string
    position?: string
    department?: string
    employee_id?: string
    phone?: string,
    is_admin?: bool,
    last_login_at: Date
}

export interface Activity {
  id: number
  title: string
  description?: string
  type: 'sms_count' | 'server_health' | 'backup' | 'monitoring' | 'other'
  metrics?: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
  latest_update?: ActivityUpdate
}

export interface ActivityUpdate {
  id: number
  activity_id: number
  user_id: number
  status: 'pending' | 'done' | 'in_progress'
  remarks?: string
  update_time: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
    position?: string
  }
}

export interface CreateActivityData {
  title: string
  description?: string
  type: string
  metrics?: Record<string, any>
}

export interface UpdateActivityData {
  status: 'pending' | 'done' | 'in_progress'
  remarks?: string
  update_time: string
}

export interface SharedPageProps extends PageProps {
    auth: {
        user: User
    }
    flash: {
        message?: string
        success?: string
        error?: string
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedPageProps { }
}