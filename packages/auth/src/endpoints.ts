import type { ApiClient } from '@havengate/api'

import type { AuthSession } from './types.ts'
import type {
  AuthTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  MeResponse,
  RefreshRequest,
} from './api-types.ts'

export const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  me: '/api/auth/me',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  forgotPassword: '/api/auth/forgot-password',
} as const

export async function loginRequest(api: ApiClient, credentials: LoginRequest): Promise<AuthSession> {
  const response = await api.public.post<AuthTokenResponse>(AUTH_ENDPOINTS.login, credentials)
  return {
    user: response.user,
    tokens: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  }
}

export function meRequest(api: ApiClient): Promise<MeResponse> {
  return api.protected.get<MeResponse>(AUTH_ENDPOINTS.me)
}

export function forgotPasswordRequest(api: ApiClient, request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return api.public.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.forgotPassword, request)
}

export function logoutRequest(api: ApiClient, request: LogoutRequest): Promise<LogoutResponse> {
  return api.public.post<LogoutResponse>(AUTH_ENDPOINTS.logout, request)
}

export function refreshRequest(api: ApiClient, request: RefreshRequest): Promise<AuthTokenResponse> {
  return api.public.post<AuthTokenResponse>(AUTH_ENDPOINTS.refresh, request)
}
