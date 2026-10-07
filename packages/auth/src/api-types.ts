import type { AuthUser, LoginCredentials } from './types.ts'

export type LoginRequest = LoginCredentials

export interface ForgotPasswordRequest {
  email: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface SetPasswordRequest {
  token: string
  password: string
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export type MeResponse = AuthUser
export type ForgotPasswordResponse = void
export type LogoutResponse = void
export type LogoutAllResponse = void
