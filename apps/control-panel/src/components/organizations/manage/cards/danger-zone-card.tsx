import * as React from 'react'
import { AlertTriangle } from 'lucide-react'

import type { Organisation } from '../../../../api/organizations'

export interface DangerZoneCardProps {
  organisation: Organisation
  saving: boolean
  onSuspend: () => void | Promise<void>
  onReactivate: () => void | Promise<void>
}

function DangerZoneCard({ organisation, saving, onSuspend, onReactivate }: DangerZoneCardProps) {
  const [confirmText, setConfirmText] = React.useState('')
  const isSuspended = organisation.status === 'SUSPENDED'
  const canConfirm = confirmText.trim() === organisation.slug

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/[0.04] p-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-destructive" />
        <p className="text-base font-semibold text-destructive">Danger zone</p>
      </div>

      {isSuspended ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-foreground">This organization is suspended</p>
            <p className="text-[11px] text-muted-foreground">Users cannot sign in until it is reactivated.</p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => onReactivate()}
            className="shrink-0 rounded-lg border border-primary bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? 'Working…' : 'Reactivate organization'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[13px] font-medium text-foreground">Suspend this organization</p>
            <p className="text-[11px] text-muted-foreground">All users will lose access immediately. This can be reversed later.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={`Type "${organisation.slug}" to confirm`}
              className="h-[38px] flex-1 rounded-lg border border-border bg-background px-3 text-[13px] text-foreground"
            />
            <button
              type="button"
              disabled={!canConfirm || saving}
              onClick={() => {
                onSuspend()
                setConfirmText('')
              }}
              className="shrink-0 rounded-lg border border-destructive bg-destructive px-3 py-2 text-[13px] font-semibold text-destructive-foreground disabled:opacity-50"
            >
              {saving ? 'Working…' : 'Suspend organization'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { DangerZoneCard }
