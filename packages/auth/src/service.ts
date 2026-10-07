import { isApiRequestError, type ApiClient, type TokenStorage } from '@havengate/api'

import {
  forgotPasswordRequest,
  loginRequest,
  logoutAllRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  setPasswordRequest,
} from './endpoints.ts'
import type { AuthSession, AuthUser, LoginCredentials } from './types.ts'

export interface AuthServiceOptions {
  api: ApiClient
  tokenStorage: TokenStorage
  refreshTokenStorage: TokenStorage
}

export interface AuthService {
  hasSession(): boolean
  login(credentials: LoginCredentials): Promise<AuthSession>
  setPassword(token: string, password: string): Promise<AuthSession>
  forgotPassword(email: string): Promise<void>
  logout(): Promise<void>
  logoutAll(): Promise<void>
  me(): Promise<AuthUser>
  refresh(): Promise<string | null>
}

export function createAuthService({ api, tokenStorage, refreshTokenStorage }: AuthServiceOptions): AuthService {
  return {
    hasSession() {
      return tokenStorage.get() !== null
    },
    async login(credentials) {
      const session = await loginRequest(api, credentials)
      tokenStorage.set(session.tokens.accessToken)
      refreshTokenStorage.set(session.tokens.refreshToken)
      return session
    },
    async setPassword(token, password) {
      const session = await setPasswordRequest(api, { token, password })
      tokenStorage.set(session.tokens.accessToken)
      refreshTokenStorage.set(session.tokens.refreshToken)
      return session
    },
    forgotPassword(email) {
      return forgotPasswordRequest(api, { email })
    },
    async logout() {
      const refreshToken = refreshTokenStorage.get()
      if (!refreshToken) {
        tokenStorage.clear()
        refreshTokenStorage.clear()
        return
      }
      try {
        await logoutRequest(api, { refreshToken })
      } finally {
        tokenStorage.clear()
        refreshTokenStorage.clear()
      }
    },
    async logoutAll() {
      try {
        await logoutAllRequest(api)
      } finally {
        tokenStorage.clear()
        refreshTokenStorage.clear()
      }
    },
    async me() {
      try {
        return await meRequest(api)
      } catch (error) {
        if (isApiRequestError(error) && error.status === 401) tokenStorage.clear()
        throw error
      }
    },
    async refresh() {
      const refreshToken = refreshTokenStorage.get()
      if (!refreshToken) return null

      const session = await refreshRequest(api, { refreshToken })
      tokenStorage.set(session.accessToken)
      refreshTokenStorage.set(session.refreshToken)
      return session.accessToken
    },
  }
}
