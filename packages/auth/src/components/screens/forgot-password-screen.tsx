import { Mail } from 'lucide-react'

import { Button, Input } from '@havengate/ui'

import * as React from 'react'

import { AuthCard, SecurityNote } from '../auth-shell.tsx'
import { isValidEmail } from '../../validation.ts'

function ForgotPasswordScreen({ email, onEmailChange, onSubmit, onBack, loading = false, serverError }: { email: string; onEmailChange: (value: string) => void; onSubmit: () => void | Promise<void>; onBack: () => void; loading?: boolean; serverError?: string | null }) {
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  function handleSubmit() {
    const nextError = isValidEmail(email) ? null : 'Enter a valid administrator email.'
    setError(nextError)
    if (nextError) return
    setSubmitting(true)
    void Promise.resolve(onSubmit()).catch(() => undefined).finally(() => setSubmitting(false))
  }

  return (
    <AuthCard badge="ACCOUNT RECOVERY" title="Forgot your password?" description="Enter your administrator email and we’ll send a secure recovery link.">
      <label className="flex flex-col gap-2 text-sm font-semibold text-auth-muted">
        Work Email
        <span className="relative">
          <Mail className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-auth-accent" />
          <Input value={email} onChange={(event) => { setError(null); onEmailChange(event.target.value) }} state={error ? 'error' : undefined} className="h-[46px] rounded-[10px] border-auth-accent bg-auth-input pl-11 text-auth-text" />
        </span>
        {error || serverError ? <span role="alert" className="text-xs font-normal text-red-300">{error ?? serverError}</span> : null}
      </label>
      <div className="flex flex-col gap-4">
        <Button onClick={handleSubmit} loading={loading || submitting} className="h-12 w-full rounded-[10px] border-auth-accent bg-auth-accent font-bold text-auth-bg">Send recovery link</Button>
        <button type="button" onClick={onBack} className="text-[13px] font-semibold text-auth-accent">Back to sign in</button>
        <SecurityNote />
      </div>
    </AuthCard>
  )
}

export { ForgotPasswordScreen }