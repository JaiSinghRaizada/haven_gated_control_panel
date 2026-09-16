import { Button } from '@havengate/ui'

import { AuthCard, OtpCode, SecurityNote } from '../auth-shell.tsx'

function MfaScreen({ code, onCodeChange, onSubmit, onResend }: { code: string; onCodeChange: (value: string) => void; onSubmit: () => void; onResend: () => void }) {
  return (
    <AuthCard badge="TWO-FACTOR AUTH" title="Confirm it’s you" description="Enter the code from your authenticator app to access Command Center.">
      <OtpCode value={code} onChange={onCodeChange} />
      <div className="flex flex-col gap-4">
        <Button onClick={onSubmit} className="h-12 w-full rounded-[10px] border-auth-accent bg-auth-accent font-bold text-auth-bg">Confirm &amp; continue</Button>
        <button type="button" onClick={onResend} className="text-[13px] font-semibold text-auth-accent">Didn’t receive a code? Send again</button>
        <SecurityNote />
      </div>
    </AuthCard>
  )
}

export { MfaScreen }