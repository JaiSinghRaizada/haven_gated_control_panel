import type { Organisation, OrganisationSecurity } from '../../../../api/organizations'
import { DangerZoneCard } from '../cards/danger-zone-card'
import { OrganizationProfileCard } from '../cards/organization-profile-card'
import { SecuritySettingsCard } from '../cards/security-settings-card'
import { SitesCard } from '../cards/sites-card'
import { UsersRolesCard } from '../cards/users-roles-card'
import { PORTFOLIO_LABELS } from '../../shared/option-lists'
import type { ProfileFormValues } from '../types'

export interface OverviewProfileTabProps {
  organisation: Organisation
  savingProfile: boolean
  profileError: string | null
  onSaveProfile: (values: ProfileFormValues) => void | Promise<void>
  savingSecurity: boolean
  securityError: string | null
  onSaveSecurity: (values: OrganisationSecurity) => void | Promise<void>
  savingStatus: boolean
  onSuspend: () => void | Promise<void>
  onReactivate: () => void | Promise<void>
}

function OverviewProfileTab({
  organisation,
  savingProfile,
  profileError,
  onSaveProfile,
  savingSecurity,
  securityError,
  onSaveSecurity,
  savingStatus,
  onSuspend,
  onReactivate,
}: OverviewProfileTabProps) {
  const portfolioLabel = organisation.portfolioType ? PORTFOLIO_LABELS[organisation.portfolioType] : 'portfolio'

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-6">
        <OrganizationProfileCard organisation={organisation} saving={savingProfile} error={profileError} onSave={onSaveProfile} />
        <SecuritySettingsCard organisation={organisation} saving={savingSecurity} error={securityError} onSave={onSaveSecurity} />
      </div>
      <div className="flex gap-6">
        <SitesCard organisationId={organisation.id} portfolioLabel={portfolioLabel} />
        <UsersRolesCard organisationId={organisation.id} />
      </div>
      <DangerZoneCard organisation={organisation} saving={savingStatus} onSuspend={onSuspend} onReactivate={onReactivate} />
    </div>
  )
}

export { OverviewProfileTab }
