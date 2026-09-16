import type * as React from 'react'
import { useState } from 'react'

import { Activity, Building2, LogOut, ShieldCheck, Users } from 'lucide-react'

import { Button } from '@havengate/ui'

export interface ControlDashboardProps {
  userName?: string
  userEmail?: string
  onLogout: () => void | Promise<void>
  loading?: boolean
}

function ControlDashboard({ userName, userEmail, onLogout, loading = false }: ControlDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="flex items-center justify-between border-b bg-surface px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-lg font-extrabold text-primary-foreground">H</div>
          <div>
            <p className="text-sm font-bold tracking-wide">HAVENGATE</p>
            <p className="font-mono text-[10px] font-semibold uppercase text-success">COMMAND CENTER</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => void handleLogout()} loading={loading || isLoggingOut}>
          <LogOut />
          Sign out
        </Button>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-success">System overview</p>
          <h1 className="text-3xl font-bold">Control Center</h1>
          <p className="text-muted-foreground">Manage HavenGate communities, users, and platform access from one place.</p>
          {userName || userEmail ? <p className="pt-2 text-sm font-medium">Signed in as {userName ?? userEmail}</p> : null}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard icon={<Building2 />} label="Organizations" value="--" />
          <OverviewCard icon={<Users />} label="Active users" value="--" />
          <OverviewCard icon={<Activity />} label="System health" value="--" />
          <OverviewCard icon={<ShieldCheck />} label="Security status" value="Protected" />
        </div>
        <div className="mt-8 rounded-xl border bg-surface p-8">
          <h2 className="text-lg font-semibold">Platform activity</h2>
          <p className="mt-2 text-sm text-muted-foreground">Control-center modules and activity feeds will appear here.</p>
        </div>
      </section>
    </main>
  )
}

function OverviewCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-surface p-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground [&_svg]:size-4">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export { ControlDashboard }