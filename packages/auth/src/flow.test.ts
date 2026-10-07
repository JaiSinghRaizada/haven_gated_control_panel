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
    const sent = authFlowReducer(forgot, { type: 'screen', screen: 'sent' })

    expect(forgot.screen).toBe('forgot')
    expect(sent.screen).toBe('sent')
  })
})
