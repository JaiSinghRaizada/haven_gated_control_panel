import * as React from 'react'
import { Pencil, ShieldCheck } from 'lucide-react'

import type { Organisation, OrganisationSecurity } from '../../../../api/organizations'

export interface SecuritySettingsCardProps {
  organisation: Organisation
  saving: boolean
  error: string | null
  onSave: (values: OrganisationSecurity) => void | Promise<void>
}

function SecuritySettingsCard({ organisation, saving, error, onSave }: SecuritySettingsCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [values, setValues] = React.useState<OrganisationSecurity>(organisation.security)
  const wasSavingRef = React.useRef(saving)

  React.useEffect(() => {
    setValues(organisation.security)
  }, [organisation.security])

  React.useEffect(() => {
    if (wasSavingRef.current && !saving && !error) {
      setIsEditing(false)
    }
    wasSavingRef.current = saving
  }, [saving, error])

  const meetsBaseline = values.mfaRequired && values.restrictToCompanyDomain && values.auditLoggingEnabled

  function updateValue(key: keyof OrganisationSecurity, value: boolean) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleEdit() {
    setValues(organisation.security)
    setIsEditing(true)
  }

  function handleCancel() {
    setValues(organisation.security)
    setIsEditing(false)
  }

  return (
    <div className="flex w-[380px] shrink-0 flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">Security &amp; settings</p>
          <p className="text-xs text-muted-foreground">Organization-wide access policies and defaults.</p>
        </div>
        {!isEditing ? (
          <button type="button" onClick={handleEdit} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
            <Pencil className="size-3.5" />
            Edit settings
          </button>
        ) : null}
      </div>

      <div className={`flex items-center gap-2 rounded-lg p-2.5 text-xs ${meetsBaseline ? 'bg-primary/[0.08] text-primary' : 'bg-warning/[0.1] text-warning'}`}>
        <ShieldCheck className="size-4 shrink-0" />
        {meetsBaseline ? 'Meets platform security baseline' : 'Does not meet the recommended security baseline'}
      </div>

      <div className="flex flex-col">
        <PolicyRow
          title="Require multi-factor authentication"
          description="Enforced for all admins and operators."
          checked={values.mfaRequired}
          editable={isEditing}
          onToggle={(value) => updateValue('mfaRequired', value)}
        />
        <PolicyRow
          title="Restrict invitations to company domain"
          description="Only addresses on the organization's domain can join."
          checked={values.restrictToCompanyDomain}
          editable={isEditing}
          onToggle={(value) => updateValue('restrictToCompanyDomain', value)}
        />
        <PolicyRow
          title="Record administrative audit events"
          description="Retain security activity for 365 days."
          checked={values.auditLoggingEnabled}
          editable={isEditing}
          onToggle={(value) => updateValue('auditLoggingEnabled', value)}
          last
        />
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {isEditing ? (
        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <button type="button" onClick={handleCancel} className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
            Cancel
          </button>
          <button type="button" disabled={saving} onClick={() => onSave(values)} className="rounded-lg border border-primary bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground disabled:opacity-50">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function PolicyRow({
  title,
  description,
  checked,
  editable,
  onToggle,
  last = false,
}: {
  title: string
  description: string
  checked: boolean
  editable: boolean
  onToggle: (value: boolean) => void
  last?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 py-3 ${last ? '' : 'border-b border-border'}`}>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={!editable}
        onClick={() => onToggle(!checked)}
        className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 size-[14px] rounded-full bg-background transition-transform ${checked ? 'translate-x-[16px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export { SecuritySettingsCard }
