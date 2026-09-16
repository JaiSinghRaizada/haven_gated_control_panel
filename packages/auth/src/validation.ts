export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validatePassword(value: string): string | null {
  if (value.length < 12) return 'Use at least 12 characters.'
  return null
}

export function validatePasswordMatch(password: string, confirmation: string): string | null {
  if (!confirmation) return 'Confirm your password.'
  if (password !== confirmation) return 'Passwords do not match.'
  return null
}

export function isCompleteCode(value: string): boolean {
  return /^\d{6}$/.test(value)
}
