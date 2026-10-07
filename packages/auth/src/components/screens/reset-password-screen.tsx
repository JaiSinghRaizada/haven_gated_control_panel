import * as React from 'react'

import { Button } from '@havengate/ui'

import { AuthCard, PasswordField, SecurityNote } from '../auth-shell.tsx'
import { validatePassword, validatePasswordMatch } from '../../validation.ts'

function ResetPasswordScreen({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  onSubmit,
  onBack,
  loading = false,
  serverError,
}: {
  password: string
  confirmPassword: string
  onPasswordChange: (value: string) => void
  onConfirmChange: (value: string) => void
  onSubmit: () => void | Promise<void>
  onBack: () => void
  loading?: boolean
  serverError?: string | null
}) {
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  function handleSubmit() {
    const nextError = validatePassword(password) ?? validatePasswordMatch(password, confirmPassword)
    setError(nextError)
    if (nextError) return
    setSubmitting(true)
    void Promise.resolve(onSubmit()).catch(() => undefined).finally(() => setSubmitting(false))
  }

  return (
    <AuthCard badge="SECURE RESET" title="Create a new password" description="Choose a strong password you haven’t used for this account before.">
      <div className="flex flex-col gap-4">
        <PasswordField label="New Password" value={password} onChange={(value) => { setError(null); onPasswordChange(value) }} />
        <PasswordField label="Confirm Password" value={confirmPassword} onChange={(value) => { setError(null); onConfirmChange(value) }} />
        {error || serverError ? <p role="alert" className="text-xs text-red-300">{error ?? serverError}</p> : null}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">{[0, 1, 2, 3].map((bar) => <span key={bar} className={`h-1 flex-1 rounded-sm ${bar < 3 ? 'bg-auth-accent' : 'bg-white/10'}`} />)}</div>
          <span className="text-xs text-auth-accent">Strong password · 12+ characters</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button onClick={handleSubmit} loading={loading || submitting} className="h-12 w-full rounded-[10px] border-auth-accent bg-auth-accent font-bold text-auth-bg">Reset password</Button>
        <button type="button" onClick={onBack} className="text-[13px] font-semibold text-auth-accent">Back to sign in</button>
        <SecurityNote />
      </div>
    </AuthCard>
  )
}

export { ResetPasswordScreen }