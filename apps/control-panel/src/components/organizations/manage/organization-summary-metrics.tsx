import type * as React from 'react'
import { Building2, LayoutGrid, ShieldCheck, Users } from 'lucide-react'

import type { Organisation } from '../../../api/organizations'
import { PORTFOLIO_LABELS } from '../shared/option-lists'

export interface OrganizationSummaryMetricsProps {
  organisation: Organisation
  siteCount: number | null
  userCount: number | null
}

function MetricTile({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5">
      <div className="rounded-lg border border-border bg-muted p-2">
        <Icon className="size-4 text-foreground" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[17px] font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

function OrganizationSummaryMetrics({ organisation, siteCount, userCount }: OrganizationSummaryMetricsProps) {
  const { security } = organisation
  const meetsBaseline = security.mfaRequired && security.restrictToCompanyDomain && security.auditLoggingEnabled

  return (
    <div className="flex w-full gap-4 p-6 pb-0">
      <MetricTile label="SITES" value={siteCount === null ? '—' : String(siteCount)} icon={Building2} />
      <MetricTile label="USERS" value={userCount === null ? '—' : String(userCount)} icon={Users} />
      <MetricTile label="PORTFOLIO TYPE" value={organisation.portfolioType ? PORTFOLIO_LABELS[organisation.portfolioType] : 'Not set'} icon={LayoutGrid} />
      <MetricTile label="SECURITY BASELINE" value={meetsBaseline ? 'Met' : 'Below baseline'} icon={ShieldCheck} />
    </div>
  )
}

export { OrganizationSummaryMetrics }
