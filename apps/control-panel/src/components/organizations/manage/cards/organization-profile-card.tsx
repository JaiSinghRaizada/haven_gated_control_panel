import * as React from 'react'
import { Pencil } from 'lucide-react'
import { FormField, Input, Select } from '@havengate/ui'

import type { Organisation, OrganisationPortfolioType } from '../../../../api/organizations'
import { COUNTRY_OPTIONS, PORTFOLIO_LABELS, TIMEZONE_OPTIONS } from '../../shared/option-lists'
import type { ProfileFormValues } from '../types'

const PORTFOLIO_OPTION_LABELS = Object.values(PORTFOLIO_LABELS)

function portfolioTypeFromLabel(label: string): OrganisationPortfolioType | undefined {
  const entry = (Object.entries(PORTFOLIO_LABELS) as [OrganisationPortfolioType, string][]).find(([, value]) => value === label)
  return entry?.[0]
}

export interface OrganizationProfileCardProps {
  organisation: Organisation
  saving: boolean
  error: string | null
  onSave: (values: ProfileFormValues) => void | Promise<void>
}

function toFormValues(organisation: Organisation): ProfileFormValues {
  return {
    name: organisation.name,
    registrationNumber: organisation.registrationNumber ?? '',
    hqCountry: organisation.hqCountry ?? '',
    primaryTimezone: organisation.primaryTimezone ?? '',
    headOfficeAddress: organisation.headOfficeAddress ?? '',
    portfolioType: organisation.portfolioType ?? undefined,
  }
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-[13px] text-foreground">{value || '—'}</p>
    </div>
  )
}

function OrganizationProfileCard({ organisation, saving, error, onSave }: OrganizationProfileCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [values, setValues] = React.useState<ProfileFormValues>(() => toFormValues(organisation))
  const wasSavingRef = React.useRef(saving)

  React.useEffect(() => {
    setValues(toFormValues(organisation))
  }, [organisation])

  React.useEffect(() => {
    if (wasSavingRef.current && !saving && !error) {
      setIsEditing(false)
    }
    wasSavingRef.current = saving
  }, [saving, error])

  function updateValue<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleEdit() {
    setValues(toFormValues(organisation))
    setIsEditing(true)
  }

  function handleCancel() {
    setValues(toFormValues(organisation))
    setIsEditing(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-5 rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">Organization profile</p>
          <p className="text-xs text-muted-foreground">Manage identity, contact details and portfolio defaults.</p>
        </div>
        {!isEditing ? (
          <button type="button" onClick={handleEdit} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
            <Pencil className="size-3.5" />
            Edit profile
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <FormField label="Organization name" htmlFor="profile-name" className="flex-1">
                <Input id="profile-name" value={values.name} onChange={(event) => updateValue('name', event.target.value)} className="h-[38px] rounded-lg border-border bg-background" />
              </FormField>
              <FormField label="Organization slug" htmlFor="profile-slug" className="flex-1" hint="Fixed after creation.">
                <Input id="profile-slug" value={organisation.slug} disabled className="h-[38px] rounded-lg border-border bg-background font-mono" />
              </FormField>
            </div>
            <div className="flex gap-4">
              <FormField label="Portfolio type" htmlFor="profile-portfolio" className="flex-1">
                <Select
                  id="profile-portfolio"
                  value={values.portfolioType ? PORTFOLIO_LABELS[values.portfolioType] : ''}
                  onValueChange={(label) => updateValue('portfolioType', portfolioTypeFromLabel(label))}
                  options={PORTFOLIO_OPTION_LABELS}
                  className="h-[38px] rounded-lg border-border bg-background"
                />
              </FormField>
              <FormField label="Registration number" htmlFor="profile-registration" className="flex-1">
                <Input id="profile-registration" value={values.registrationNumber} onChange={(event) => updateValue('registrationNumber', event.target.value)} className="h-[38px] rounded-lg border-border bg-background" />
              </FormField>
            </div>
            <div className="flex gap-4">
              <FormField label="Headquarters country" htmlFor="profile-country" className="flex-1">
                <Select id="profile-country" value={values.hqCountry} onValueChange={(value) => updateValue('hqCountry', value)} options={COUNTRY_OPTIONS} className="h-[38px] rounded-lg border-border bg-background" />
              </FormField>
              <FormField label="Primary timezone" htmlFor="profile-timezone" className="flex-1">
                <Select id="profile-timezone" value={values.primaryTimezone} onValueChange={(value) => updateValue('primaryTimezone', value)} options={TIMEZONE_OPTIONS} className="h-[38px] rounded-lg border-border bg-background" />
              </FormField>
            </div>
            <FormField label="Head office address" htmlFor="profile-address" error={error}>
              <Input id="profile-address" value={values.headOfficeAddress} onChange={(event) => updateValue('headOfficeAddress', event.target.value)} className="h-[38px] rounded-lg border-border bg-background" />
            </FormField>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-[11px] text-muted-foreground">Changes apply to this organization only.</p>
            <div className="flex gap-2">
              <button type="button" onClick={handleCancel} className="rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
                Cancel
              </button>
              <button type="button" disabled={saving} onClick={() => onSave(values)} className="rounded-lg border border-primary bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground disabled:opacity-50">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <ReadOnlyField label="Organization name" value={organisation.name} />
            <ReadOnlyField label="Organization slug" value={organisation.slug} />
          </div>
          <div className="flex gap-4">
            <ReadOnlyField label="Portfolio type" value={organisation.portfolioType ? PORTFOLIO_LABELS[organisation.portfolioType] : ''} />
            <ReadOnlyField label="Registration number" value={organisation.registrationNumber ?? ''} />
          </div>
          <div className="flex gap-4">
            <ReadOnlyField label="Headquarters country" value={organisation.hqCountry ?? ''} />
            <ReadOnlyField label="Primary timezone" value={organisation.primaryTimezone ?? ''} />
          </div>
          <ReadOnlyField label="Head office address" value={organisation.headOfficeAddress ?? ''} />
        </div>
      )}
    </div>
  )
}

export { OrganizationProfileCard }
