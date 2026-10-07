import type { OrganisationPortfolioType } from '../../../api/organizations'

export interface ProfileFormValues {
  name: string
  registrationNumber: string
  hqCountry: string
  primaryTimezone: string
  headOfficeAddress: string
  portfolioType: OrganisationPortfolioType | undefined
}

export type ManageTabKey = 'overview' | 'sites' | 'users' | 'security'

export interface ManageTab {
  key: ManageTabKey
  label: string
}

export const MANAGE_TABS: ManageTab[] = [
  { key: 'overview', label: 'Overview & profile' },
  { key: 'sites', label: 'Sites' },
  { key: 'users', label: 'Users & roles' },
  { key: 'security', label: 'Security & settings' },
]
