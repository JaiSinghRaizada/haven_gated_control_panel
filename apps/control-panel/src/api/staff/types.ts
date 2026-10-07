export type StaffRole = 'ORG_ADMIN' | 'SITE_INCHARGE' | 'MAINTENANCE_HEAD' | 'SECURITY_SUPERVISOR' | 'GUARD' | 'STAFF'
export type MembershipStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED'

export interface StaffMembershipUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean
}

export interface StaffMembership {
  id: string
  userId: string
  organisationId: string
  siteId: string | null
  role: StaffRole
  status: MembershipStatus
  createdAt: string
  updatedAt: string
  user: StaffMembershipUser
  site: { id: string; name: string } | null
}

export interface StaffMembershipPage {
  items: StaffMembership[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
