import { describe, expect, it } from 'vitest'

import { isCompleteCode, isValidEmail, validatePassword, validatePasswordMatch } from './validation.ts'

describe('auth validation', () => {
  it('accepts a valid email and rejects malformed values', () => {
    expect(isValidEmail('admin@havengate.com')).toBe(true)
    expect(isValidEmail('admin@')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  it('requires six numeric verification digits', () => {
    expect(isCompleteCode('123456')).toBe(true)
    expect(isCompleteCode('12345')).toBe(false)
    expect(isCompleteCode('12345a')).toBe(false)
  })

  it('requires a strong password and matching confirmation', () => {
    expect(validatePassword('short')).toBe('Use at least 12 characters.')
    expect(validatePassword('long-password-123')).toBeNull()
    expect(validatePasswordMatch('long-password-123', '')).toBe('Confirm your password.')
    expect(validatePasswordMatch('long-password-123', 'different')).toBe('Passwords do not match.')
    expect(validatePasswordMatch('long-password-123', 'long-password-123')).toBeNull()
  })
})
