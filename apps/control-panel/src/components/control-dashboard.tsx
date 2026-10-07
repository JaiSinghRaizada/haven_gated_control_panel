import { Toaster } from '@havengate/ui'
import { Navigate, Outlet, Route, Routes } from 'react-router'

import { ROUTES } from '../routes'
import { ConsoleSidebar } from './layout/console-sidebar'
import { OnboardOrganizationPage } from './organizations/onboard-organization-page'
import { OrganizationsDashboard } from './organizations/organizations-dashboard'
import { OverviewPage } from './overview/overview-page'

export interface ControlDashboardProps {
  userName?: string
  userEmail?: string
  isSuperAdmin?: boolean
  onLogout: () => void | Promise<void>
}

function ControlDashboard({ userName, userEmail, isSuperAdmin, onLogout }: ControlDashboardProps) {
  return (
    <>
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.dashboard} replace />} />
        <Route element={<ConsoleLayout userName={userName} userEmail={userEmail} isSuperAdmin={isSuperAdmin} onLogout={onLogout} />}>
          <Route path={ROUTES.dashboard} element={<OverviewPage userName={userName} />} />
          <Route path={ROUTES.organizations} element={<OrganizationsDashboard />} />
        </Route>
        <Route path={ROUTES.onboardOrganization} element={<OnboardOrganizationPage userName={userName} userEmail={userEmail} />} />
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

function ConsoleLayout({ userName, userEmail, isSuperAdmin, onLogout }: ControlDashboardProps) {
  return (
    <div className="dark flex h-svh w-full items-stretch overflow-hidden bg-background text-foreground">
      <ConsoleSidebar userName={userName} userEmail={userEmail} isSuperAdmin={isSuperAdmin} onLogout={onLogout} />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export { ControlDashboard }
