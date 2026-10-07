import type * as React from 'react'

import { Building, Clock, Home, LayoutGrid, LogOut, Settings, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { toast } from '@havengate/ui'

import { ROUTES } from '../../routes'

interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  to?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: Home, to: ROUTES.dashboard },
  { label: 'Organizations', icon: Building, to: ROUTES.organizations },
  { label: 'Global Sites', icon: LayoutGrid },
  { label: 'Operators & Roles', icon: Users },
  { label: 'System Audit Logs', icon: Clock },
  { label: 'Global Settings', icon: Settings },
]

export interface ConsoleSidebarProps {
  userName?: string
  userEmail?: string
  isSuperAdmin?: boolean
  onLogout: () => void | Promise<void>
}

function initials(name: string | undefined, email: string | undefined): string {
  const source = name?.trim() || email?.trim() || ''
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function ConsoleSidebar({ userName, userEmail, isSuperAdmin, onLogout }: ConsoleSidebarProps) {
  const { pathname } = useLocation()

  return (
    <div className="bg-sidebar border-r border-sidebar-border flex h-full w-[280px] shrink-0 flex-col justify-between px-6 py-8">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <div className="flex size-10 items-center justify-center rounded-[10px] bg-primary text-xl font-extrabold text-primary-foreground">H</div>
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-bold text-sidebar-foreground">HAVENGATE</p>
            <p className="font-mono text-[9px] font-semibold uppercase text-primary">Superadmin Portal</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] font-normal text-primary">CORE DIRECTORY</p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.to === pathname
              const Icon = item.icon
              const className = `flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left ${active ? 'border-sidebar-accent-foreground/30 bg-sidebar-accent' : 'border-transparent hover:bg-sidebar-accent/40'}`
              const content = (
                <>
                  <Icon className={`size-[18px] ${active ? 'text-sidebar-foreground' : 'text-muted-foreground'}`} />
                  <p className={`flex-1 text-sm ${active ? 'font-semibold text-sidebar-foreground' : 'font-medium text-muted-foreground'}`}>{item.label}</p>
                  {item.badge !== undefined ? (
                    <span className="rounded-[6px] bg-primary px-2 py-0.5 font-mono text-[10px] font-bold text-primary-foreground">{item.badge}</span>
                  ) : null}
                </>
              )
              if (item.to) {
                return (
                  <Link key={item.label} to={item.to} className={className}>
                    {content}
                  </Link>
                )
              }
              return (
                <button key={item.label} type="button" onClick={() => toast(`${item.label} is coming soon`)} className={className}>
                  {content}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3 rounded-[10px] border border-sidebar-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] text-muted-foreground">SYSTEM HEALTH</p>
            <span className="size-1.5 rounded-full bg-primary" />
          </div>
          <div className="flex items-center justify-between whitespace-nowrap">
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[9px] text-disabled-foreground">API TIME</p>
              <p className="text-xs font-semibold text-sidebar-foreground">24ms</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[9px] text-disabled-foreground">UPTIME</p>
              <p className="text-xs font-semibold text-sidebar-foreground">99.99%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-accent">
            <p className="text-xs font-bold text-accent-foreground">{initials(userName, userEmail)}</p>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-[13px] font-semibold text-sidebar-foreground">{userName ?? userEmail ?? 'Administrator'}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{isSuperAdmin ? 'Superadministrator' : 'Administrator'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="flex items-center justify-center gap-2 rounded-[8px] border border-sidebar-border py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-sidebar-foreground"
        >
          <LogOut className="size-[14px]" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export { ConsoleSidebar }
