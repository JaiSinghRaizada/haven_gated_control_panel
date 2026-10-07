import { AuthProvider, AdminAuthFlow, createAuthService, GuestOnly, RequireAuth, useAuth, type AuthBranding } from '@havengate/auth'

import { api, refreshTokenStorage, registerRefreshHandler, tokenStorage } from './lib/api'
import { OrgDashboard } from './components/org-dashboard'

const authService = createAuthService({ api, tokenStorage, refreshTokenStorage })
registerRefreshHandler(() => authService.refresh())

const branding: AuthBranding = {
  appLabel: 'HavenGate Org Panel',
  tagline: 'Community Management',
  heroImageSrc: '/havengate-tower.png',
  heroImageAlt: 'HavenGate Tower at night',
  heroTitle: 'Run your community, without the busywork',
  heroDescription: 'One place for organization admins to manage residents, staff, and access at HavenGate Tower.',
  heroTags: ['ENCRYPTED', '24/7 MONITORED'],
  loginBadge: 'ORG PANEL',
  loginTitle: 'Organization Portal',
  loginDescription: 'Manage your community, residents, and staff access.',
}

function App() {
  return (
    <AuthProvider service={authService}>
      <OrgPanelContent />
    </AuthProvider>
  )
}

function OrgPanelContent() {
  const { status, user, logout } = useAuth()
  if (status === 'loading') return <SessionLoading />
  if (status === 'authenticated') {
    return <RequireAuth fallback={<AdminAuthFlow branding={branding} />}><OrgDashboard userName={user?.fullName} userEmail={user?.email} onLogout={logout} /></RequireAuth>
  }
  return <GuestOnly fallback={<SessionLoading />}><AdminAuthFlow branding={branding} /></GuestOnly>
}

function SessionLoading() {
  return <main className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">Restoring your session...</main>
}

export default App
