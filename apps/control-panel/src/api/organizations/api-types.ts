import type { Organisation, OrganisationPortfolioType, OrganisationStatus } from './types.ts'

export interface OnboardOrganisationOwnerRequest {
  fullName: string
  email: string
  phone?: string
}

/** Shared by onboarding and later profile edits — the backend's security DTO is the same shape either way. */
export interface OrganisationSecurityPatch {
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
  security?: OrganisationSecurityPatch
}

/** Every profile field is editable; the slug is fixed once an organisation is created. */
export interface UpdateOrganisationRequest {
  name?: string
  registrationNumber?: string
  hqCountry?: string
  primaryTimezone?: string
  headOfficeAddress?: string
  portfolioType?: OrganisationPortfolioType
  defaultLanguage?: string
  defaultCurrency?: string
  security?: OrganisationSecurityPatch
  status?: OrganisationStatus
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
