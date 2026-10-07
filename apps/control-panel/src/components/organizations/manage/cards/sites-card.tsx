import * as React from 'react'
import { Building2, Plus } from 'lucide-react'
import { toast } from '@havengate/ui'

import { listSitesRequest, type Site } from '../../../../api/sites'

export interface SitesCardProps {
  organisationId: string
  portfolioLabel: string
}

const PREVIEW_COUNT = 3

function SitesCard({ organisationId, portfolioLabel }: SitesCardProps) {
  const [sites, setSites] = React.useState<Site[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true
    listSitesRequest(organisationId).then(
      (result) => {
        if (active) setSites(result)
      },
      () => {
        if (active) setError('Could not load sites.')
      },
    )
    return () => {
      active = false
    }
  }, [organisationId])

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">Sites</p>
          <p className="text-xs text-muted-foreground">{sites ? `${sites.length} sites in this ${portfolioLabel.toLowerCase()}.` : 'Loading sites…'}</p>
        </div>
        <button type="button" onClick={() => toast('Adding a site is coming soon')} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
          <Plus className="size-3.5" />
          Add site
        </button>
      </div>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col">
          {(sites ?? []).slice(0, PREVIEW_COUNT).map((site) => (
            <div key={site.id} className="flex items-center gap-3 border-b border-border py-3.5 last:border-b-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                <Building2 className="size-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-foreground">{site.name}</p>
                <p className="text-[11px] text-muted-foreground">{site.city ?? 'No city set'}</p>
              </div>
              <span className={`rounded-md border px-2 py-1 font-mono text-[10px] ${site.isActive ? 'border-primary/30 bg-primary/[0.08] text-primary' : 'border-border bg-muted text-muted-foreground'}`}>{site.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
          {sites && sites.length === 0 ? <p className="py-3 text-xs text-muted-foreground">No sites yet.</p> : null}
        </div>
      )}

      {sites && sites.length > 0 ? (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Showing {Math.min(PREVIEW_COUNT, sites.length)} of {sites.length} sites
          </p>
          <button type="button" onClick={() => toast('Managing all sites is coming soon')} className="text-xs font-semibold text-primary">
            Manage all sites →
          </button>
        </div>
      ) : null}
    </div>
  )
}

export { SitesCard }
