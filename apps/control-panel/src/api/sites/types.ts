export interface Site {
  id: string
  organisationId: string
  name: string
  addressLine: string | null
  city: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
