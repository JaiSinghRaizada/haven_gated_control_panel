import { ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from '@havengate/ui'

import type { Organisation } from '../../../api/organizations'
import { ROUTES } from '../../../routes'
import { PORTFOLIO_LABELS } from '../shared/option-lists'
import { StatusBadge } from '../shared/status-badge'

export interface OrganizationHeaderProps {
  organisation: Organisation
}

function monogram(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function OrganizationHeader({ organisation }: OrganizationHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-border p-6">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to={ROUTES.organizations} className="hover:text-foreground">
          Organizations
        </Link>
        <ChevronRight className="size-3.5" />
        <p className="text-foreground">{organisation.name}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
          <p className="text-base font-bold text-foreground">{monogram(organisation.name)}</p>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-foreground">{organisation.name}</h1>
            <StatusBadge status={organisation.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <p className="font-mono">{organisation.slug}</p>
            {organisation.portfolioType ? (
              <>
                <span>·</span>
                <p>{PORTFOLIO_LABELS[organisation.portfolioType]}</p>
              </>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => toast('Viewing the audit log is coming soon')}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground"
        >
          <FileText className="size-3.5" />
          View audit log
        </button>
      </div>
    </div>
  )
}

export { OrganizationHeader }
