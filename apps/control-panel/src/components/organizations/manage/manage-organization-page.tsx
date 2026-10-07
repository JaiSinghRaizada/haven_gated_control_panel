import * as React from 'react'
import { getErrorMessage } from '@havengate/api'
import { useParams } from 'react-router'

import { toast } from '@havengate/ui'

import { getOrganisationRequest, updateOrganisationRequest, type Organisation, type OrganisationSecurity } from '../../../api/organizations'
import { listSitesRequest } from '../../../api/sites'
import { listStaffRequest } from '../../../api/staff'
import { OrganizationHeader } from './organization-header'
import { OrganizationSummaryMetrics } from './organization-summary-metrics'
import { OrganizationTabs } from './organization-tabs'
import { OverviewProfileTab } from './tabs/overview-profile-tab'
import { MANAGE_TABS, type ManageTabKey, type ProfileFormValues } from './types'

function ManageOrganizationPage() {
  const { organisationId } = useParams<{ organisationId: string }>()
  const [organisation, setOrganisation] = React.useState<Organisation | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [activeTab] = React.useState<ManageTabKey>('overview')

  function handleTabChange(key: ManageTabKey) {
    if (key !== 'overview') {
      toast('This section is coming soon')
      return
    }
  }

  const [siteCount, setSiteCount] = React.useState<number | null>(null)
  const [userCount, setUserCount] = React.useState<number | null>(null)

  const [savingProfile, setSavingProfile] = React.useState(false)
  const [profileError, setProfileError] = React.useState<string | null>(null)
  const [savingSecurity, setSavingSecurity] = React.useState(false)
  const [securityError, setSecurityError] = React.useState<string | null>(null)
  const [savingStatus, setSavingStatus] = React.useState(false)

  const fetchOrganisation = React.useCallback((id: string) => {
    getOrganisationRequest(id).then(
      (result) => setOrganisation(result),
      (caught: unknown) => setLoadError(getErrorMessage(caught)),
    )
  }, [])

  React.useEffect(() => {
    if (!organisationId) return
    fetchOrganisation(organisationId)
  }, [fetchOrganisation, organisationId])

  React.useEffect(() => {
    if (!organisationId) return
    let active = true
    listSitesRequest(organisationId).then(
      (result) => {
        if (active) setSiteCount(result.length)
      },
      () => undefined,
    )
    listStaffRequest(organisationId, 1, 1).then(
      (result) => {
        if (active) setUserCount(result.meta.total)
      },
      () => undefined,
    )
    return () => {
      active = false
    }
  }, [organisationId])

  async function handleSaveProfile(values: ProfileFormValues) {
    if (!organisationId) return
    setSavingProfile(true)
    setProfileError(null)
    try {
      const updated = await updateOrganisationRequest(organisationId, {
        name: values.name,
        registrationNumber: values.registrationNumber || undefined,
        hqCountry: values.hqCountry || undefined,
        primaryTimezone: values.primaryTimezone || undefined,
        headOfficeAddress: values.headOfficeAddress || undefined,
        portfolioType: values.portfolioType,
      })
      setOrganisation(updated)
      toast('Organization profile updated')
    } catch (caught) {
      setProfileError(getErrorMessage(caught))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleSaveSecurity(values: OrganisationSecurity) {
    if (!organisationId) return
    setSavingSecurity(true)
    setSecurityError(null)
    try {
      const updated = await updateOrganisationRequest(organisationId, { security: values })
      setOrganisation(updated)
      toast('Security settings updated')
    } catch (caught) {
      setSecurityError(getErrorMessage(caught))
    } finally {
      setSavingSecurity(false)
    }
  }

  async function handleSetStatus(status: Organisation['status']) {
    if (!organisationId) return
    setSavingStatus(true)
    try {
      const updated = await updateOrganisationRequest(organisationId, { status })
      setOrganisation(updated)
      toast(status === 'SUSPENDED' ? 'Organization suspended' : 'Organization reactivated')
    } catch (caught) {
      toast(getErrorMessage(caught))
    } finally {
      setSavingStatus(false)
    }
  }

  if (loadError) {
    return <p className="p-10 text-center text-sm text-destructive">{loadError}</p>
  }

  if (!organisation) {
    return <p className="p-10 text-center text-sm text-muted-foreground">Loading organization…</p>
  }

  return (
    <div className="flex flex-1 flex-col">
      <OrganizationHeader organisation={organisation} />
      <OrganizationSummaryMetrics organisation={organisation} siteCount={siteCount} userCount={userCount} />
      <OrganizationTabs tabs={MANAGE_TABS} activeKey={activeTab} onChange={handleTabChange} />

      <OverviewProfileTab
        organisation={organisation}
        savingProfile={savingProfile}
        profileError={profileError}
        onSaveProfile={handleSaveProfile}
        savingSecurity={savingSecurity}
        securityError={securityError}
        onSaveSecurity={handleSaveSecurity}
        savingStatus={savingStatus}
        onSuspend={() => handleSetStatus('SUSPENDED')}
        onReactivate={() => handleSetStatus('ACTIVE')}
      />
    </div>
  )
}

export { ManageOrganizationPage }
