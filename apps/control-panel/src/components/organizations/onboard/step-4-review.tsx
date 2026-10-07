import { ShieldCheck } from 'lucide-react'

import { PORTFOLIO_LABELS } from './constants'
import { useFocusOnMount } from './hooks'
import type { OnboardForm, WizardStep } from './types'

export interface Step4ReviewProps {
  form: OnboardForm
  error: string | null
  onEditStep: (step: WizardStep) => void
}

function Step4Review({ form, error, onEditStep }: Step4ReviewProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>()
  const securityLines: string[] = []
  if (form.requireMfa) securityLines.push('MFA required')
  if (form.restrictToCompanyDomain) securityLines.push('Company-domain invitations enabled')
  if (form.auditLogging) securityLines.push('Audit logging enabled')

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] text-primary">STEP 4 OF 4 · REVIEW</p>
        <h1 ref={headingRef} tabIndex={-1} className="rounded text-[32px] font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          Review and launch your organization
        </h1>
        <p className="text-sm text-muted-foreground">Everything looks ready. Launching creates the organization workspace; your first site can be added immediately afterward.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-[0px_18px_20px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-2 rounded-[10px] border border-primary bg-accent px-5 py-4">
          <ShieldCheck className="size-7 text-primary" />
          <p className="text-lg font-bold text-foreground">Ready to launch</p>
          <p className="text-sm text-muted-foreground">All required organization details and protections are configured.</p>
          <span className="mt-1 w-fit rounded-full bg-background px-3 py-1 font-mono text-[10px] font-bold text-primary">4 OF 4 COMPLETE</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <ReviewRow label="ORGANIZATION" primary={form.name || '—'} secondary={[form.hqCountry, form.primaryTimezone].filter(Boolean).join(' · ') || undefined} onEdit={() => onEditStep(1)} />
          <ReviewRow label="PORTFOLIO" primary={PORTFOLIO_LABELS[form.portfolioType]} secondary={`${form.defaultLanguage} · ${form.defaultCurrency}`} onEdit={() => onEditStep(2)} />
          <ReviewRow label="PRIMARY OWNER" primary={`${form.ownerFirstName} ${form.ownerLastName}`.trim() || '—'} secondary={form.ownerEmail || undefined} onEdit={() => onEditStep(3)} />
          <ReviewRow label="SECURITY" primary={securityLines[0] ?? 'No baseline protections selected'} secondary={securityLines.slice(1).join(' · ') || undefined} onEdit={() => onEditStep(3)} />
        </div>

        <div className="flex flex-col gap-1.5 rounded-[10px] border border-border px-4 py-3 text-xs">
          <p className="font-semibold text-foreground">Next:</p>
          <p className="text-muted-foreground">Create your first site, invite your operating team, and connect resident systems.</p>
        </div>

        {error ? <p role="alert" className="text-xs text-destructive">{error}</p> : null}
      </div>
    </>
  )
}

function ReviewRow({ label, primary, secondary, onEdit }: { label: string; primary: string; secondary?: string; onEdit: () => void }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] border border-border bg-muted px-4 py-2.5">
      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{primary}</p>
      {secondary ? <p className="text-xs text-muted-foreground">{secondary}</p> : null}
      <button type="button" onClick={onEdit} className="w-fit text-xs font-bold text-primary">
        Edit
      </button>
    </div>
  )
}

export { Step4Review }
