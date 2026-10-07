import * as React from 'react'
import { getErrorMessage } from '@havengate/api'
import { Building2, Info, LayoutGrid, Search, ShieldCheck, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button, Input } from '@havengate/ui'

import { listOrganisationsRequest, type OrganisationPage, type OrganisationStatus } from '../../api/organizations'
import { ROUTES } from '../../routes'
import { StatusBadge } from './shared/status-badge'

const PAGE_SIZE = 10

const STATUS_FILTERS: { key: 'all' | OrganisationStatus; label: string }[] = [
  { key: 'all', label: 'All Organizations' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'SUSPENDED', label: 'Suspended' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function StatTile({ label, value, trend, trendLabel, icon: Icon }: { label: string; value: string; trend: string; trendLabel: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] text-muted-foreground">{label}</p>
        <div className="rounded-lg border border-border bg-muted p-2">
          <Icon className="size-4 text-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[28px] font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-primary">{trend}</span>
          <span className="text-disabled-foreground">{trendLabel}</span>
        </div>
      </div>
    </div>
  )
}

function OrganizationsDashboard() {
  const navigate = useNavigate()
  const [page, setPage] = React.useState(1)
  const [data, setData] = React.useState<OrganisationPage | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | OrganisationStatus>('all')

  const fetchPage = React.useCallback((targetPage: number) => {
    setLoading(true)
    setError(null)
    listOrganisationsRequest(targetPage, PAGE_SIZE).then(
      (result) => {
        setData(result)
        setLoading(false)
      },
      (caught: unknown) => {
        setError(getErrorMessage(caught))
        setLoading(false)
      },
    )
  }, [])

  React.useEffect(() => {
    fetchPage(page)
  }, [fetchPage, page])

  const filtered = (data?.items ?? []).filter((org) => {
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || org.name.toLowerCase().includes(query) || org.slug.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="flex flex-1 flex-col gap-8 p-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] text-primary">SUPERADMIN DASHBOARD</p>
          <h1 className="text-[32px] font-bold text-foreground">Global Organizations</h1>
          <p className="text-sm text-muted-foreground">Manage portfolio setups, security baseline rules, and organization life-cycles.</p>
        </div>
        <Button asChild className="gap-2 shadow-[0px_18px_20px_rgba(0,0,0,0.4)]">
          <Link to={ROUTES.onboardOrganization}>
            Onboard Organization
            <span aria-hidden className="text-lg leading-none">+</span>
          </Link>
        </Button>
      </div>

      <div className="flex w-full gap-5">
        <StatTile label="TOTAL ORGANIZATIONS" value={data ? String(data.meta.total) : '—'} trend="Live" trendLabel="from API" icon={Building2} />
        <StatTile label="MANAGED SITES" value="—" trend="Not tracked" trendLabel="yet" icon={LayoutGrid} />
        <StatTile label="TOTAL RESIDENTS" value="—" trend="Not tracked" trendLabel="yet" icon={Users} />
        <StatTile label="SECURITY AUDIT" value="—" trend="Not tracked" trendLabel="yet" icon={ShieldCheck} />
      </div>

      <div className="flex w-full flex-col rounded-2xl border border-border bg-card shadow-[0px_24px_24px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="relative w-[320px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search this page by name, slug..."
              className="h-auto rounded-[10px] border-border bg-muted py-2.5 pl-11 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2.5">
            {STATUS_FILTERS.map((filter) => {
              const active = filter.key === statusFilter
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setStatusFilter(filter.key)}
                  className={`rounded-lg border px-3 py-2 text-[13px] ${active ? 'border-primary/30 bg-accent font-semibold text-primary' : 'border-border bg-muted text-muted-foreground'}`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex w-full gap-4 border-b border-border bg-sidebar px-6 py-3 font-mono text-[11px] text-muted-foreground">
          <p className="flex-1">ORGANIZATION DETAILS</p>
          <p className="w-[160px]">STATUS</p>
          <p className="w-[140px]">CREATED</p>
          <p className="w-[120px] text-right">ACTIONS</p>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">Loading organizations…</p>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <button type="button" onClick={() => fetchPage(page)} className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((org) => (
              <div key={org.id} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0">
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-[15px] font-semibold text-foreground">{org.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{org.slug}</p>
                </div>
                <div className="w-[160px]">
                  <StatusBadge status={org.status} />
                </div>
                <p className="w-[140px] text-sm text-muted-foreground">{formatDate(org.createdAt)}</p>
                <div className="flex w-[120px] justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.organizationDetail(org.id))}
                    className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 ? <p className="px-6 py-8 text-center text-sm text-muted-foreground">No organizations match this page's filters.</p> : null}
          </div>
        )}

        <div className="flex items-center justify-between p-4">
          <p className="text-[13px] text-muted-foreground">{data ? `Showing page ${data.meta.page} of ${Math.max(data.meta.totalPages, 1)} · ${data.meta.total} total organizations` : ''}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || (data?.meta.page ?? 1) <= 1}
              className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs text-foreground disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={loading || !data || data.meta.page >= data.meta.totalPages}
              className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs text-foreground disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 rounded-xl border border-primary/30 bg-accent p-6">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-primary" />
          <p className="text-[15px] font-semibold text-primary">Superadmin Tip</p>
        </div>
        <p className="text-[13px] leading-[1.5] text-foreground">
          Organizations can bypass local configuration defaults during setup. Once launched, local site-admins may override general timezones, currencies, and multi-factor enforcement directly in their respective sub-sites.
        </p>
      </div>
    </div>
  )
}

export { OrganizationsDashboard }
