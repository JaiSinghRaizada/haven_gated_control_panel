import { Checkbox, FormField, Input } from '@havengate/ui'

import { useFocusOnMount } from './hooks'
import type { OnboardForm, UpdateField } from './types'

export interface Step3AdminSecurityProps {
  form: OnboardForm
  updateField: UpdateField
  onOwnerFirstNameChange: (value: string) => void
  onOwnerLastNameChange: (value: string) => void
  onOwnerEmailChange: (value: string) => void
  onOwnerPhoneChange: (value: string) => void
  ownerNameError: string | null
  ownerEmailError: string | null
}

function Step3AdminSecurity({ form, updateField, onOwnerFirstNameChange, onOwnerLastNameChange, onOwnerEmailChange, onOwnerPhoneChange, ownerNameError, ownerEmailError }: Step3AdminSecurityProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>()
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] text-primary">STEP 3 OF 4 · ACCESS</p>
        <h1 ref={headingRef} tabIndex={-1} className="rounded text-[32px] font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          Set up administration &amp; security
        </h1>
        <p className="text-sm text-muted-foreground">Confirm the first organization owner and choose baseline access protections for every administrative account.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-[0px_18px_20px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-3">
          <p className="text-lg text-foreground">Primary organization owner</p>
          <div className="flex gap-4">
            <FormField label="First name" htmlFor="owner-first-name" className="flex-1" required error={ownerNameError}>
              <Input id="owner-first-name" value={form.ownerFirstName} onChange={(event) => onOwnerFirstNameChange(event.target.value)} placeholder="Jane" className="h-[42px] rounded-[10px] border-border bg-muted" />
            </FormField>
            <FormField label="Last name" htmlFor="owner-last-name" className="flex-1" required>
              <Input id="owner-last-name" value={form.ownerLastName} onChange={(event) => onOwnerLastNameChange(event.target.value)} placeholder="Doe" className="h-[42px] rounded-[10px] border-border bg-muted" />
            </FormField>
          </div>
          <div className="flex gap-4">
            <FormField label="Work email" htmlFor="owner-email" className="flex-1" required error={ownerEmailError}>
              <Input id="owner-email" type="email" value={form.ownerEmail} onChange={(event) => onOwnerEmailChange(event.target.value)} placeholder="jane.doe@example.com" className="h-[42px] rounded-[10px] border-border bg-muted" />
            </FormField>
            <FormField label="Phone" htmlFor="owner-phone" className="flex-1" hint="Optional, E.164 format.">
              <Input id="owner-phone" type="tel" value={form.ownerPhone} onChange={(event) => onOwnerPhoneChange(event.target.value)} placeholder="+14155550123" className="h-[42px] rounded-[10px] border-border bg-muted" />
            </FormField>
          </div>

          <div className="flex items-start gap-2.5 rounded-[10px] border border-primary/30 bg-primary/[0.08] px-3 py-2 text-xs">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <p className="leading-relaxed text-muted-foreground">The primary owner receives full organization access and can appoint additional administrators.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 rounded-[10px] border border-border bg-muted px-4 py-3.5">
          <p className="text-lg text-foreground">Security baseline</p>
          <SecurityOption checked={form.requireMfa} onCheckedChange={(checked) => updateField('requireMfa', checked)} title="Require multi-factor authentication" description="Protect every administrative sign-in." />
          <SecurityOption
            checked={form.restrictToCompanyDomain}
            onCheckedChange={(checked) => updateField('restrictToCompanyDomain', checked)}
            title="Restrict invitations to company domain"
            description="Only addresses on your organization's domain can join."
          />
          <SecurityOption checked={form.auditLogging} onCheckedChange={(checked) => updateField('auditLogging', checked)} title="Record administrative audit events" description="Retain security activity for 365 days." />
        </div>
      </div>
    </>
  )
}

function SecurityOption({ checked, onCheckedChange, title, description }: { checked: boolean; onCheckedChange: (checked: boolean) => void; title: string; description: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-2">
      <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} className="mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </label>
  )
}

export { Step3AdminSecurity }
