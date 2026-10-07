import * as React from 'react'
import { getErrorMessage } from '@havengate/api'
import { Button, Dialog, toast } from '@havengate/ui'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { onboardOrganisationRequest } from '../../api/organizations'
import { ROUTES } from '../../routes'
import { OnboardSidebar } from './onboard/onboard-sidebar'
import { Step1Identity } from './onboard/step-1-identity'
import { Step2OperatingProfile } from './onboard/step-2-operating-profile'
import { Step3AdminSecurity } from './onboard/step-3-admin-security'
import { Step4Review } from './onboard/step-4-review'
import { hasUnsavedChanges, INITIAL_FORM, type OnboardForm, type WizardStep } from './onboard/types'
import { isValidEmail, isValidSlug, slugify } from './onboard/validation'

export interface OnboardOrganizationPageProps {
  userName?: string
  userEmail?: string
}

interface FieldErrors {
  name?: string
  slug?: string
  ownerName?: string
  ownerEmail?: string
}

function OnboardOrganizationPage({ userName, userEmail }: OnboardOrganizationPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = React.useState<WizardStep>(1)
  const [form, setForm] = React.useState(INITIAL_FORM)
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false)

  const formRef = React.useRef(form)
  React.useEffect(() => {
    formRef.current = form
  }, [form])

  React.useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (hasUnsavedChanges(formRef.current)) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  function updateField<K extends keyof OnboardForm>(key: K, value: OnboardForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleNameChange(value: string) {
    updateField('name', value)
    if (!slugTouched) updateField('slug', slugify(value))
    setFieldErrors((current) => ({ ...current, name: undefined }))
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true)
    updateField('slug', value)
    setFieldErrors((current) => ({ ...current, slug: undefined }))
  }

  function handleOwnerFirstNameChange(value: string) {
    updateField('ownerFirstName', value)
    setFieldErrors((current) => ({ ...current, ownerName: undefined }))
  }

  function handleOwnerLastNameChange(value: string) {
    updateField('ownerLastName', value)
    setFieldErrors((current) => ({ ...current, ownerName: undefined }))
  }

  function handleOwnerEmailChange(value: string) {
    updateField('ownerEmail', value)
    setFieldErrors((current) => ({ ...current, ownerEmail: undefined }))
  }

  function handleOwnerPhoneChange(value: string) {
    updateField('ownerPhone', value)
  }

  function goToStep(target: WizardStep) {
    setSubmitError(null)
    setStep(target)
  }

  function handleLeaveClick(event: React.MouseEvent) {
    if (submitting) {
      event.preventDefault()
      return
    }
    if (hasUnsavedChanges(form)) {
      event.preventDefault()
      setLeaveDialogOpen(true)
    }
  }

  function confirmLeave() {
    setLeaveDialogOpen(false)
    navigate(ROUTES.organizations)
  }

  function validateStep1(): boolean {
    const nextErrors: FieldErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Organization name must be at least 2 characters.'
    if (!isValidSlug(form.slug)) nextErrors.slug = 'Slug must be lowercase letters, digits and hyphens only.'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validateStep3(): boolean {
    const nextErrors: FieldErrors = {}
    if (form.ownerFirstName.trim().length < 1 || form.ownerLastName.trim().length < 1) nextErrors.ownerName = 'Enter the primary owner’s first and last name.'
    if (!isValidEmail(form.ownerEmail)) nextErrors.ownerEmail = 'Enter a valid work email for the primary owner.'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleLaunch() {
    setSubmitError(null)
    setSubmitting(true)
    try {
      const { organisation } = await onboardOrganisationRequest({
        name: form.name.trim(),
        slug: form.slug.trim(),
        registrationNumber: form.registrationNumber.trim() || undefined,
        hqCountry: form.hqCountry.trim() || undefined,
        primaryTimezone: form.primaryTimezone.trim() || undefined,
        headOfficeAddress: form.headOfficeAddress.trim() || undefined,
        portfolioType: form.portfolioType,
        defaultLanguage: form.defaultLanguage.trim() || undefined,
        defaultCurrency: form.defaultCurrency.trim() || undefined,
        owner: {
          fullName: `${form.ownerFirstName.trim()} ${form.ownerLastName.trim()}`.trim(),
          email: form.ownerEmail.trim(),
          phone: form.ownerPhone.trim() || undefined,
        },
        security: {
          mfaRequired: form.requireMfa,
          restrictToCompanyDomain: form.restrictToCompanyDomain,
          auditLoggingEnabled: form.auditLogging,
        },
      })
      toast(`${organisation.name} added to the directory`, { variant: 'success' })
      navigate(ROUTES.organizations)
    } catch (caught) {
      setSubmitError(getErrorMessage(caught))
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    if (step === 1) {
      if (validateStep1()) setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      if (validateStep3()) setStep(4)
    } else {
      void handleLaunch()
    }
  }

  return (
    <div className="dark flex min-h-svh w-full bg-background text-foreground">
      <OnboardSidebar step={step} onGoToStep={goToStep} userName={userName} userEmail={userEmail} />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-7 px-14 py-9">
          <Link
            to={ROUTES.organizations}
            onClick={handleLeaveClick}
            aria-disabled={submitting}
            className={`flex w-fit items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground ${submitting ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ArrowLeft className="size-3.5" />
            Back to Organizations
          </Link>

          {step === 1 ? (
            <Step1Identity form={form} updateField={updateField} onNameChange={handleNameChange} onSlugChange={handleSlugChange} nameError={fieldErrors.name ?? null} slugError={fieldErrors.slug ?? null} />
          ) : null}
          {step === 2 ? <Step2OperatingProfile form={form} updateField={updateField} /> : null}
          {step === 3 ? (
            <Step3AdminSecurity
              form={form}
              updateField={updateField}
              onOwnerFirstNameChange={handleOwnerFirstNameChange}
              onOwnerLastNameChange={handleOwnerLastNameChange}
              onOwnerPhoneChange={handleOwnerPhoneChange}
              onOwnerEmailChange={handleOwnerEmailChange}
              ownerNameError={fieldErrors.ownerName ?? null}
              ownerEmailError={fieldErrors.ownerEmail ?? null}
            />
          ) : null}
          {step === 4 ? <Step4Review form={form} error={submitError} onEditStep={goToStep} /> : null}
        </div>

        <div className="flex items-center justify-between border-t border-sidebar-border bg-sidebar px-14 py-4">
          <p className="text-xs text-muted-foreground">Progress is kept only in this session until you launch</p>
          <div className="flex gap-3">
            {step === 1 ? (
              <Button asChild variant="secondary">
                <Link to={ROUTES.organizations} onClick={handleLeaveClick}>Cancel</Link>
              </Button>
            ) : (
              <Button type="button" variant="secondary" disabled={submitting} onClick={() => goToStep((step - 1) as WizardStep)}>
                Back
              </Button>
            )}
            <Button type="submit" loading={submitting} className="gap-2">
              {step === 1 ? 'Continue to profile' : step === 2 ? 'Continue to admin' : step === 3 ? 'Review organization' : 'Launch organization'}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </form>

      <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)} title="Leave without finishing?" description="Your progress on this organization won’t be saved.">
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setLeaveDialogOpen(false)}>
            Stay and continue
          </Button>
          <Button variant="destructive" onClick={confirmLeave}>
            Leave without saving
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export { OnboardOrganizationPage }
