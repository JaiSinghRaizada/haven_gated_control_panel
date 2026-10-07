export type AuthScreen = 'login' | 'forgot' | 'sent' | 'reset' | 'mfa'

export interface AuthFlowState {
  screen: AuthScreen
  email: string
  code: string
  newPassword: string
  confirmPassword: string
  resetToken: string
}

export type AuthFlowAction =
  | { type: 'screen'; screen: AuthScreen }
  | { type: 'email'; value: string }
  | { type: 'code'; value: string }
  | { type: 'new-password'; value: string }
  | { type: 'confirm-password'; value: string }

export const initialAuthFlowState: AuthFlowState = {
  screen: 'login',
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
  resetToken: '',
}

export function createAuthFlowState(overrides: Partial<AuthFlowState> = {}): AuthFlowState {
  return { ...initialAuthFlowState, ...overrides }
}

export function authFlowReducer(state: AuthFlowState, action: AuthFlowAction): AuthFlowState {
  switch (action.type) {
    case 'screen':
      return { ...state, screen: action.screen }
    case 'email':
      return { ...state, email: action.value }
    case 'code':
      return { ...state, code: action.value }
    case 'new-password':
      return { ...state, newPassword: action.value }
    case 'confirm-password':
      return { ...state, confirmPassword: action.value }
  }
}
