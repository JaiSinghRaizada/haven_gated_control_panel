import { FormField, Input, Select } from '@havengate/ui'

import { COUNTRY_OPTIONS, TIMEZONE_OPTIONS } from './constants'
import { useFocusOnMount } from './hooks'
import type { OnboardForm, UpdateField } from './types'

export interface Step1IdentityProps {
  form: OnboardForm
  updateField: UpdateField
  onNameChange: (value: string) => void
  onSlugChange: (value: string) => void
  nameError: string | null
  slugError: string | null
}

function Step1Identity({ form, updateField, onNameChange, onSlugChange, nameError, slugError }: Step1IdentityProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>()
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] text-primary">STEP 1 OF 4 · IDENTITY</p>
        <h1 ref={headingRef} tabIndex={-1} className="rounded text-[32px] font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          Tell us about your organization
        </h1>
        <p className="text-sm text-muted-foreground">This creates the organization workspace that will contain every site, team, resident, and operating policy.</p>
      </div>

      <div className="flex flex-col gap-7 rounded-2xl border border-border bg-card p-8 shadow-[0px_18px_20px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-1">
          <p className="text-xl text-foreground">Organization identity</p>
          <p className="text-sm text-muted-foreground">Use the legal details your teams will recognize across HavenGate.</p>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label="Organization name" htmlFor="org-name" required error={nameError}>
            <Input id="org-name" value={form.name} onChange={(event) => onNameChange(event.target.value)} placeholder="Acme Property Group" className="h-[50px] rounded-[10px] border-border bg-muted" />
          </FormField>
          <div className="flex gap-6">
            <FormField label="Organization slug" htmlFor="org-slug" required className="flex-1" error={slugError} hint={slugError ? undefined : 'Unique identifier used in URLs and API references. Lowercase letters, numbers, and hyphens only.'}>
              <Input id="org-slug" value={form.slug} onChange={(event) => onSlugChange(event.target.value)} placeholder="acme-property-group" className="h-[50px] rounded-[10px] border-border bg-muted" />
            </FormField>
            <FormField label="Registration number" htmlFor="org-registration" className="flex-1">
              <Input id="org-registration" value={form.registrationNumber} onChange={(event) => updateField('registrationNumber', event.target.value)} placeholder="REG-000000" className="h-[50px] rounded-[10px] border-border bg-muted" />
            </FormField>
          </div>
          <div className="flex gap-6">
            <FormField label="Headquarters country" htmlFor="org-country" className="flex-1">
              <Select id="org-country" value={form.hqCountry} onValueChange={(value) => updateField('hqCountry', value)} options={COUNTRY_OPTIONS} className="h-[50px] rounded-[10px] border-border bg-muted" />
            </FormField>
            <FormField label="Primary timezone" htmlFor="org-timezone" className="flex-1">
              <Select id="org-timezone" value={form.primaryTimezone} onValueChange={(value) => updateField('primaryTimezone', value)} options={TIMEZONE_OPTIONS} className="h-[50px] rounded-[10px] border-border bg-muted" />
            </FormField>
          </div>
          <FormField label="Head office address" htmlFor="org-address">
            <Input id="org-address" value={form.headOfficeAddress} onChange={(event) => updateField('headOfficeAddress', event.target.value)} placeholder="123 Main Street, Springfield, IL 62701" className="h-[50px] rounded-[10px] border-border bg-muted" />
          </FormField>
        </div>
      </div>
    </>
  )
}

export { Step1Identity }
