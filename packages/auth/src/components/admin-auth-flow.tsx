import * as React from 'react'

import { useAuth } from '../context.tsx'
import { authFlowReducer, createAuthFlowState, type AuthScreen } from '../flow.ts'
import type { AuthBranding } from '../types.ts'
import { AuthShell } from './auth-shell.tsx'
import { ForgotPasswordScreen } from './screens/forgot-password-screen.tsx'
import { LoginScreen } from './screens/login-screen.tsx'
import { MfaScreen } from './screens/mfa-screen.tsx'
import { ResetPasswordScreen } from './screens/reset-password-screen.tsx'
import { SentScreen } from './screens/sent-screen.tsx'

function getResetTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('token')
}

function AdminAuthFlow({ branding }: { branding: AuthBranding }) {
  const { login, setPassword, forgotPassword, error, isAuthenticating } = useAuth()
  const [state, dispatch] = React.useReducer(authFlowReducer, undefined, () => {
    const resetToken = getResetTokenFromUrl()
    return createAuthFlowState(resetToken ? { screen: 'reset', resetToken } : {})
  })
  const setScreen = (screen: AuthScreen) => dispatch({ type: 'screen', screen })

  function renderScreen() {
    switch (state.screen) {
      case 'login':
        return <LoginScreen branding={branding} onForgot={() => setScreen('forgot')} onSubmit={login} loading={isAuthenticating} error={error} />
      case 'forgot':
        return <ForgotPasswordScreen email={state.email} onEmailChange={(value) => dispatch({ type: 'email', value })} onSubmit={async () => { await forgotPassword(state.email); setScreen('sent') }} onBack={() => setScreen('login')} loading={isAuthenticating} serverError={error} />
      case 'sent':
        return <SentScreen email={state.email} onBackToLogin={() => setScreen('login')} />
      case 'reset':
        return (
          <ResetPasswordScreen
            password={state.newPassword}
            confirmPassword={state.confirmPassword}
            onPasswordChange={(value) => dispatch({ type: 'new-password', value })}
            onConfirmChange={(value) => dispatch({ type: 'confirm-password', value })}
            onSubmit={() => setPassword(state.resetToken, state.newPassword)}
            onBack={() => setScreen('login')}
            loading={isAuthenticating}
            serverError={error}
          />
        )
      case 'mfa':
        return <MfaScreen code={state.code} onCodeChange={(value) => dispatch({ type: 'code', value })} onSubmit={() => setScreen('login')} onResend={() => dispatch({ type: 'code', value: '' })} />
    }
  }

  return <AuthShell branding={branding}>{renderScreen()}</AuthShell>
}

export { AdminAuthFlow }
