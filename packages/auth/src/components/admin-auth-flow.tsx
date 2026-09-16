import * as React from 'react'

import { useAuth } from '../context.tsx'
import { authFlowReducer, initialAuthFlowState, type AuthScreen } from '../flow.ts'
import { AuthShell } from './auth-shell.tsx'
import { ForgotPasswordScreen } from './screens/forgot-password-screen.tsx'
import { LoginScreen } from './screens/login-screen.tsx'
import { MfaScreen } from './screens/mfa-screen.tsx'
import { ResetPasswordScreen } from './screens/reset-password-screen.tsx'
import { SentScreen } from './screens/sent-screen.tsx'
import { SuccessScreen } from './screens/success-screen.tsx'
import { VerificationScreen } from './screens/verification-screen.tsx'

function AdminAuthFlow() {
  const { login, forgotPassword, status, error } = useAuth()
  const [state, dispatch] = React.useReducer(authFlowReducer, initialAuthFlowState)
  const setScreen = (screen: AuthScreen) => dispatch({ type: 'screen', screen })

  function renderScreen() {
    switch (state.screen) {
      case 'login':
        return <LoginScreen onForgot={() => setScreen('forgot')} onSubmit={login} loading={status === 'loading'} error={error} />
      case 'forgot':
        return <ForgotPasswordScreen email={state.email} onEmailChange={(value) => dispatch({ type: 'email', value })} onSubmit={async () => { await forgotPassword(state.email); setScreen('sent') }} onBack={() => setScreen('login')} loading={status === 'loading'} serverError={error} />
      case 'sent':
        return <SentScreen email={state.email} onContinue={() => setScreen('verify')} />
      case 'verify':
        return <VerificationScreen code={state.code} onCodeChange={(value) => dispatch({ type: 'code', value })} onSubmit={() => setScreen('reset')} onResend={() => dispatch({ type: 'code', value: '' })} />
      case 'reset':
        return <ResetPasswordScreen password={state.newPassword} confirmPassword={state.confirmPassword} onPasswordChange={(value) => dispatch({ type: 'new-password', value })} onConfirmChange={(value) => dispatch({ type: 'confirm-password', value })} onSubmit={() => setScreen('success')} />
      case 'success':
        return <SuccessScreen onContinue={() => setScreen('login')} />
      case 'mfa':
        return <MfaScreen code={state.code} onCodeChange={(value) => dispatch({ type: 'code', value })} onSubmit={() => setScreen('login')} onResend={() => dispatch({ type: 'code', value: '' })} />
    }
  }

  return <AuthShell>{renderScreen()}</AuthShell>
}

export { AdminAuthFlow }
