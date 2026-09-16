import * as React from 'react'

import { Button } from '@havengate/ui'

import { AuthCard, OtpCode, SecurityNote } from '../auth-shell.tsx'
import { isCompleteCode } from '../../validation.ts'

function VerificationScreen({ code, onCodeChange, onSubmit, onResend }: { code: string; onCodeChange: (value: string) => void; onSubmit: () => void; onResend: () => void }) {
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit() {
    const nextError = isCompleteCode(code) ? null : 'Enter all 6 digits.'
    setError(nextError)
    if (!nextError) onSubmit()
  }

  return (
    <AuthCard badge="IDENTITY CHECK" title="Enter verification code" description="Enter the six-digit code sent to your work email. It expires in 09:42.">
      <OtpCode value={code} onChange={(value) => { setError(null); onCodeChange(value) }} />
      {error ? <p role="alert" className="text-xs text-red-300">{error}</p> : null}
      <div className="flex flex-col gap-4">
        <Button onClick={handleSubmit} className="h-12 w-full rounded-[10px] border-auth-accent bg-auth-accent font-bold text-auth-bg">Verify code</Button>
        <button type="button" onClick={onResend} className="text-[13px] font-semibold text-auth-accent">Didn’t receive a code? Send again</button>
        <SecurityNote />
      </div>
    </AuthCard>
  )
}

export { VerificationScreen }