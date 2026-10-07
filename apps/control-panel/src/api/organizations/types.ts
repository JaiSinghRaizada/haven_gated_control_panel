export type OrganisationStatus = 'ACTIVE' | 'SUSPENDED'
export type OrganisationPortfolioType = 'RESIDENTIAL' | 'MIXED_USE' | 'HOSPITALITY'

export interface OrganisationOwner {
  id: string
  email: string
  fullName: string
}

export interface OrganisationSecurity {
  mfaRequired: boolean
  restrictToCompanyDomain: boolean
  auditLoggingEnabled: boolean
}

export interface Organisation {
  id: string
  name: string
  slug: string
  status: OrganisationStatus
  registrationNumber: string | null
  hqCountry: string | null
  primaryTimezone: string | null
  headOfficeAddress: string | null
  portfolioType: OrganisationPortfolioType | null
  defaultLanguage: string | null
  defaultCurrency: string | null
  security: OrganisationSecurity
  ownerUserId: string | null
  owner: OrganisationOwner | null
  createdAt: string
  updatedAt: string
}

export interface OrganisationPage {
  items: Organisation[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
