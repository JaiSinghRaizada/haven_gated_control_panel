export const ROUTES = {
  root: '/',
  dashboard: '/dashboard',
  organizations: '/organizations',
  onboardOrganization: '/organizations/onboard',
  organizationDetailPattern: '/organizations/:organisationId',
  organizationDetail: (organisationId: string) => `/organizations/${organisationId}`,
} as const
