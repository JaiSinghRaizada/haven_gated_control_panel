import { api } from '../../lib/api'
import type { OnboardOrganisationRequest, OnboardOrganisationResponse, UpdateOrganisationRequest } from './api-types.ts'
import type { Organisation, OrganisationPage } from './types.ts'

export const ORGANISATION_ENDPOINTS = {
  list: '/api/organisations',
  onboard: '/api/organisations/onboarding',
  detail: (id: string) => `/api/organisations/${id}`,
} as const

export function listOrganisationsRequest(page: number, limit: number): Promise<OrganisationPage> {
  return api.protected.get<OrganisationPage>(ORGANISATION_ENDPOINTS.list, { query: { page, limit } })
}

export function onboardOrganisationRequest(request: OnboardOrganisationRequest): Promise<OnboardOrganisationResponse> {
  return api.protected.post<OnboardOrganisationResponse>(ORGANISATION_ENDPOINTS.onboard, request)
}

export function getOrganisationRequest(id: string): Promise<Organisation> {
  return api.protected.get<Organisation>(ORGANISATION_ENDPOINTS.detail(id))
}

export function updateOrganisationRequest(id: string, request: UpdateOrganisationRequest): Promise<Organisation> {
  return api.protected.patch<Organisation>(ORGANISATION_ENDPOINTS.detail(id), request)
}
