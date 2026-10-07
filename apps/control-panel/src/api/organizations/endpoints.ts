import { api } from '../../lib/api'
import type { OnboardOrganisationRequest, OnboardOrganisationResponse } from './api-types.ts'
import type { OrganisationPage } from './types.ts'

export const ORGANISATION_ENDPOINTS = {
  list: '/api/organisations',
  onboard: '/api/organisations/onboarding',
} as const

export function listOrganisationsRequest(page: number, limit: number): Promise<OrganisationPage> {
  return api.protected.get<OrganisationPage>(ORGANISATION_ENDPOINTS.list, { query: { page, limit } })
}

export function onboardOrganisationRequest(request: OnboardOrganisationRequest): Promise<OnboardOrganisationResponse> {
  return api.protected.post<OnboardOrganisationResponse>(ORGANISATION_ENDPOINTS.onboard, request)
}
