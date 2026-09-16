import { AuthProvider, AdminAuthFlow, createAuthService, GuestOnly, RequireAuth, useAuth } from '@havengate/auth'

import { api, refreshTokenStorage, tokenStorage } from './lib/api'
import { ControlDashboard } from './components/control-dashboard'

const authService = createAuthService({ api, tokenStorage, refreshTokenStorage })

function App() {
  return (
    <AuthProvider service={authService}>
      <ControlPanelContent />
    </AuthProvider>
  )
}

function ControlPanelContent() {
  const { status, user, logout } = useAuth()
  if (status === 'loading') return <SessionLoading />
  if (status === 'authenticated') {
    return <RequireAuth fallback={<AdminAuthFlow />}><ControlDashboard userName={user?.fullName} userEmail={user?.email} onLogout={logout} /></RequireAuth>
  }
  return <GuestOnly fallback={<SessionLoading />}><AdminAuthFlow /></GuestOnly>
}

function SessionLoading() {
  return <main className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">Restoring your session...</main>
}

export default App
