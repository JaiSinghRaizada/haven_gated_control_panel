import { LoginForm } from '../login-form.tsx'
import { AuthCard } from '../auth-shell.tsx'
import type { AuthBranding, LoginCredentials } from '../../types.ts'

function LoginScreen({ branding, onForgot, onSubmit, loading, error }: { branding: AuthBranding; onForgot: () => void; onSubmit: (credentials: LoginCredentials) => void | Promise<void>; loading?: boolean; error?: string | null }) {
  return (
    <AuthCard badge={branding.loginBadge} title={branding.loginTitle} description={branding.loginDescription}>
      <LoginForm onForgot={onForgot} onSubmit={onSubmit} loading={loading} error={error} />
    </AuthCard>
  )
}

export { LoginScreen }