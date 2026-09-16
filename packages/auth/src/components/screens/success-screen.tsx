import { Confirmation } from '../auth-shell.tsx'

function SuccessScreen({ onContinue }: { onContinue: () => void }) {
  return <Confirmation icon="check" title="Password reset complete" description="Your administrator credentials have been updated securely." action="Return to sign in" onAction={onContinue} />
}

export { SuccessScreen }