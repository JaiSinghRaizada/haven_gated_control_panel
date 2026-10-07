import type { ApiClient } from '@havengate/api'

import type { AuthSession } from './types.ts'
import type {
  AuthTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LogoutAllResponse,
  LogoutRequest,
  LogoutResponse,
  MeResponse,
  RefreshRequest,
  SetPasswordRequest,
} from './api-types.ts'

export const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  me: '/api/users/me',
  logout: '/api/auth/logout',
  logoutAll: '/api/auth/logout-all',
  refresh: '/api/auth/refresh',
  forgotPassword: '/api/auth/forgot-password',
  setPassword: '/api/auth/set-password',
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

export function logoutAllRequest(api: ApiClient): Promise<LogoutAllResponse> {
  return api.protected.post<LogoutAllResponse>(AUTH_ENDPOINTS.logoutAll)
}

export async function setPasswordRequest(api: ApiClient, request: SetPasswordRequest): Promise<AuthSession> {
  const response = await api.public.post<AuthTokenResponse>(AUTH_ENDPOINTS.setPassword, request)
  return {
    user: response.user,
    tokens: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  }
}
