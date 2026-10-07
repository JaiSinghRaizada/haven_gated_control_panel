import * as React from 'react'
import { getErrorMessage } from '@havengate/api'

import type { AuthService } from './service.ts'
import type { AuthState, LoginCredentials } from './types.ts'

export interface AuthContextValue extends AuthState {
  login(credentials: LoginCredentials): Promise<void>
  setPassword(token: string, password: string): Promise<void>
  forgotPassword(email: string): Promise<void>
  logout(): Promise<void>
  logoutAll(): Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export interface AuthProviderProps {
  service: AuthService
  children: React.ReactNode
}

function AuthProvider({ service, children }: AuthProviderProps) {
  const [state, setState] = React.useState<AuthState>({
    status: service.hasSession() ? 'loading' : 'unauthenticated',
    user: null,
    error: null,
    isAuthenticating: false,
  })

  React.useEffect(() => {
    if (!service.hasSession()) return

    let active = true
    void service.me().then(
      (user) => {
        if (active) setState({ status: 'authenticated', user, error: null, isAuthenticating: false })
      },
      (error: unknown) => {
        if (active) setState({ status: 'unauthenticated', user: null, error: getErrorMessage(error), isAuthenticating: false })
      },
    )

    return () => {
      active = false
    }
  }, [service])

  async function login(credentials: LoginCredentials) {
    setState((current) => ({ ...current, isAuthenticating: true, error: null }))
    try {
      const session = await service.login(credentials)
      setState({ status: 'authenticated', user: session.user, error: null, isAuthenticating: false })
    } catch (error) {
      setState({ status: 'unauthenticated', user: null, error: getErrorMessage(error), isAuthenticating: false })
      throw error
    }
  }

  async function setPassword(token: string, password: string) {
    setState((current) => ({ ...current, isAuthenticating: true, error: null }))
    try {
      const session = await service.setPassword(token, password)
      setState({ status: 'authenticated', user: session.user, error: null, isAuthenticating: false })
    } catch (error) {
      setState((current) => ({ ...current, isAuthenticating: false, error: getErrorMessage(error) }))
      throw error
    }
  }

  async function forgotPassword(email: string) {
    setState((current) => ({ ...current, error: null }))
    try {
      await service.forgotPassword(email)
    } catch (error) {
      setState((current) => ({ ...current, error: getErrorMessage(error) }))
      throw error
    }
  }

  async function logout() {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    try {
      await service.logout()
      setState({ status: 'unauthenticated', user: null, error: null, isAuthenticating: false })
    } catch (error) {
      setState((current) => ({ ...current, status: 'authenticated', error: getErrorMessage(error) }))
      throw error
    }
  }

  async function logoutAll() {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    try {
      await service.logoutAll()
      setState({ status: 'unauthenticated', user: null, error: null, isAuthenticating: false })
    } catch (error) {
      setState((current) => ({ ...current, status: 'authenticated', error: getErrorMessage(error) }))
      throw error
    }
  }

  const value: AuthContextValue = { ...state, login, setPassword, forgotPassword, logout, logoutAll }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export { AuthProvider, useAuth }
