import { describe, expect, it } from 'vitest'

import { authFlowReducer, initialAuthFlowState } from './flow.ts'

describe('authFlowReducer', () => {
  it('updates one flow value without mutating the others', () => {
    const next = authFlowReducer(initialAuthFlowState, { type: 'email', value: 'admin@havengate.local' })

    expect(next.email).toBe('admin@havengate.local')
    expect(next.screen).toBe('login')
    expect(next.code).toBe(initialAuthFlowState.code)
    expect(next).not.toBe(initialAuthFlowState)
  })

  it('changes screens through explicit actions', () => {
    const forgot = authFlowReducer(initialAuthFlowState, { type: 'screen', screen: 'forgot' })
    const verify = authFlowReducer(forgot, { type: 'screen', screen: 'verify' })

    expect(forgot.screen).toBe('forgot')
    expect(verify.screen).toBe('verify')
  })
})
