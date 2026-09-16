export const APP_NAMES = {
  control: 'HavenGate Control Panel',
  org: 'HavenGate Org Panel',
} as const

export function formatDate(value: string | Date, locale = 'en-GB'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
