import { LoginForm } from '../login-form.tsx'
import { AuthCard } from '../auth-shell.tsx'
import type { LoginCredentials } from '../../types.ts'

function LoginScreen({ onForgot, onSubmit, loading, error }: { onForgot: () => void; onSubmit: (credentials: LoginCredentials) => void | Promise<void>; loading?: boolean; error?: string | null }) {
  return (
    <AuthCard badge="COMMAND CENTER" title="Command Center" description="Real-time intelligence and telemetry of HavenGate Tower">
      <LoginForm onForgot={onForgot} onSubmit={onSubmit} loading={loading} error={error} />
    </AuthCard>
  )
}

export { LoginScreen }