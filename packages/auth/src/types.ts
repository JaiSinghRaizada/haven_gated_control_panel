export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  phone: string
  fullName: string
  avatarUrl: string
  isSuperAdmin: boolean
  isActive: boolean
  hasPassword: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  error: string | null
}
