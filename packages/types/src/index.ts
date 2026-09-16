export type Id = string

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface Organization extends Timestamps {
  id: Id
  name: string
  slug: string
}

export type UserRole = 'admin' | 'org_admin' | 'resident' | 'guard'

export interface User extends Timestamps {
  id: Id
  email: string
  name: string
  role: UserRole
  organizationId: Id | null
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  status: number
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
  error?: Omit<ApiError, 'status'>
}
