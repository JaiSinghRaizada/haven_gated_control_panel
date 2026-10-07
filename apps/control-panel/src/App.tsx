import { AuthProvider, AdminAuthFlow, createAuthService, GuestOnly, RequireAuth, useAuth, type AuthBranding } from '@havengate/auth'

import { api, refreshTokenStorage, registerRefreshHandler, tokenStorage } from './lib/api'
import { ControlDashboard } from './components/control-dashboard'

const authService = createAuthService({ api, tokenStorage, refreshTokenStorage })
registerRefreshHandler(() => authService.refresh())

const branding: AuthBranding = {
  appLabel: 'HavenGate Control',
  tagline: 'Luxury Living',
  heroImageSrc: '/havengate-tower.png',
  heroImageAlt: 'HavenGate Tower at night',
  heroTitle: 'Secure access, without compromise',
  heroDescription: 'Identity protection engineered for the people who operate HavenGate Tower.',
  heroTags: ['ENCRYPTED', '24/7 MONITORED'],
  loginBadge: 'COMMAND CENTER',
  loginTitle: 'Command Center',
  loginDescription: 'Real-time intelligence and telemetry of HavenGate Tower',
}

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
    return <RequireAuth fallback={<AdminAuthFlow branding={branding} />}><ControlDashboard userName={user?.fullName} userEmail={user?.email} isSuperAdmin={user?.isSuperAdmin} onLogout={logout} /></RequireAuth>
  }
  return <GuestOnly fallback={<SessionLoading />}><AdminAuthFlow branding={branding} /></GuestOnly>
}

function SessionLoading() {
  return <main className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">Restoring your session...</main>
}

export default App
