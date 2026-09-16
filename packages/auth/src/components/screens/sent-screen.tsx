import { Confirmation } from '../auth-shell.tsx'

function SentScreen({ email, onContinue }: { email: string; onContinue: () => void }) {
  return <Confirmation icon="mail" title="Check your inbox" description={`We sent recovery instructions to ${email}.`} action="Open email app" onAction={onContinue} />
}

export { SentScreen }