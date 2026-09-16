import * as React from 'react'

import { useAuth } from './context.tsx'

export interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

function RequireAuth({ children, fallback = null, loading = null }: AuthGuardProps) {
  const { status } = useAuth()
  if (status === 'loading' || status === 'idle') return <>{loading}</>
  return <>{status === 'authenticated' ? children : fallback}</>
}

function GuestOnly({ children, fallback = null, loading = null }: AuthGuardProps) {
  const { status } = useAuth()
  if (status === 'loading' || status === 'idle') return <>{loading}</>
  return <>{status === 'authenticated' ? fallback : children}</>
}

export { RequireAuth, GuestOnly }
