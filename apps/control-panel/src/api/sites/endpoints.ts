import { api } from '../../lib/api'
import type { Site } from './types.ts'

export const SITE_ENDPOINTS = {
  list: '/api/sites',
} as const

/** Super admins act on an organisation's tenant-scoped routes via this header. */
export function listSitesRequest(organisationId: string): Promise<Site[]> {
  return api.protected.get<Site[]>(SITE_ENDPOINTS.list, { headers: { 'x-organisation-id': organisationId } })
}
