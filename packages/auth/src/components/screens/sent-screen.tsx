import { Confirmation } from '../auth-shell.tsx'

function SentScreen({ email, onBackToLogin }: { email: string; onBackToLogin: () => void }) {
  return <Confirmation icon="mail" title="Check your inbox" description={`We sent recovery instructions to ${email}.`} action="Back to sign in" onAction={onBackToLogin} />
}

export { SentScreen }