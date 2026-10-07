import { api } from '../../lib/api'
import type { StaffMembershipPage } from './types.ts'

export const STAFF_ENDPOINTS = {
  list: '/api/staff',
} as const

export function listStaffRequest(organisationId: string, page: number, limit: number): Promise<StaffMembershipPage> {
  return api.protected.get<StaffMembershipPage>(STAFF_ENDPOINTS.list, {
    query: { page, limit },
    headers: { 'x-organisation-id': organisationId },
  })
}
