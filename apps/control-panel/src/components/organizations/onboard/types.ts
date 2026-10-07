import type { OrganisationPortfolioType } from '../../../api/organizations'

export type WizardStep = 1 | 2 | 3 | 4

export interface SetupStep {
  number: WizardStep
  label: string
}

export const SETUP_STEPS: SetupStep[] = [
  { number: 1, label: 'Organization details' },
  { number: 2, label: 'Operating profile' },
  { number: 3, label: 'Admin & security' },
  { number: 4, label: 'Review & launch' },
]

export interface OnboardForm {
  name: string
  slug: string
  registrationNumber: string
  hqCountry: string
  primaryTimezone: string
  headOfficeAddress: string
  portfolioType: OrganisationPortfolioType
  defaultLanguage: string
  defaultCurrency: string
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPhone: string
  requireMfa: boolean
  restrictToCompanyDomain: boolean
  auditLogging: boolean
}

export const INITIAL_FORM: OnboardForm = {
  name: '',
  slug: '',
  registrationNumber: '',
  hqCountry: 'United States',
  primaryTimezone: 'Pacific Time (UTC-08:00)',
  headOfficeAddress: '',
  portfolioType: 'RESIDENTIAL',
  defaultLanguage: 'English (US)',
  defaultCurrency: 'USD - US Dollar',
  ownerFirstName: '',
  ownerLastName: '',
  ownerEmail: '',
  ownerPhone: '',
  requireMfa: true,
  restrictToCompanyDomain: true,
  auditLogging: true,
}

export type UpdateField = <K extends keyof OnboardForm>(key: K, value: OnboardForm[K]) => void

export function hasUnsavedChanges(form: OnboardForm): boolean {
  return (Object.keys(INITIAL_FORM) as (keyof OnboardForm)[]).some((key) => form[key] !== INITIAL_FORM[key])
}
