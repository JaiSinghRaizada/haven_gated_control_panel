import * as React from 'react'

import { Button } from '@havengate/ui'

import { AuthCard, PasswordField, SecurityNote } from '../auth-shell.tsx'
import { validatePassword, validatePasswordMatch } from '../../validation.ts'

function ResetPasswordScreen({ password, confirmPassword, onPasswordChange, onConfirmChange, onSubmit }: { password: string; confirmPassword: string; onPasswordChange: (value: string) => void; onConfirmChange: (value: string) => void; onSubmit: () => void }) {
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit() {
    const nextError = validatePassword(password) ?? validatePasswordMatch(password, confirmPassword)
    setError(nextError)
    if (!nextError) onSubmit()
  }

  return (
    <AuthCard badge="SECURE RESET" title="Create a new password" description="Choose a strong password you haven’t used for this account before.">
      <div className="flex flex-col gap-4">
        <PasswordField label="New Password" value={password} onChange={(value) => { setError(null); onPasswordChange(value) }} />
        <PasswordField label="Confirm Password" value={confirmPassword} onChange={(value) => { setError(null); onConfirmChange(value) }} />
        {error ? <p role="alert" className="text-xs text-red-300">{error}</p> : null}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">{[0, 1, 2, 3].map((bar) => <span key={bar} className={`h-1 flex-1 rounded-sm ${bar < 3 ? 'bg-auth-accent' : 'bg-white/10'}`} />)}</div>
          <span className="text-xs text-auth-accent">Strong password · 12+ characters</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button onClick={handleSubmit} className="h-12 w-full rounded-[10px] border-auth-accent bg-auth-accent font-bold text-auth-bg">Reset password</Button>
        <SecurityNote />
      </div>
    </AuthCard>
  )
}

export { ResetPasswordScreen }