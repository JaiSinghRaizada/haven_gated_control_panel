import type { Organisation, OrganisationPortfolioType } from './types.ts'

export interface OnboardOrganisationOwnerRequest {
  fullName: string
  email: string
  phone?: string
}

export interface OnboardOrganisationSecurityRequest {
  mfaRequired?: boolean
  restrictToCompanyDomain?: boolean
  auditLoggingEnabled?: boolean
}

export interface OnboardOrganisationRequest {
  name: string
  slug: string
  registrationNumber?: string
  hqCountry?: string
  primaryTimezone?: string
  headOfficeAddress?: string
  portfolioType?: OrganisationPortfolioType
  defaultLanguage?: string
  defaultCurrency?: string
  owner: OnboardOrganisationOwnerRequest
  security?: OnboardOrganisationSecurityRequest
}

export interface OnboardOrganisationMembership {
  id: string
  userId: string
  organisationId: string
  siteId: string | null
  role: string
  status: string
}

export interface OnboardOrganisationResponse {
  organisation: Organisation
  ownerMembership: OnboardOrganisationMembership
}
