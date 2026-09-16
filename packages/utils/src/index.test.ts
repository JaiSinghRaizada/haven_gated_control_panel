import { describe, expect, it, vi } from 'vitest'

import { APP_NAMES, formatDate, sleep } from './index.ts'

describe('APP_NAMES', () => {
  it('has distinct names per app', () => {
    expect(APP_NAMES.control).not.toBe(APP_NAMES.org)
  })
})

describe('formatDate', () => {
  it('formats ISO strings and Date objects identically', () => {
    const iso = '2026-09-04T10:00:00.000Z'
    expect(formatDate(iso)).toBe(formatDate(new Date(iso)))
  })

  it('respects the locale argument', () => {
    const iso = '2026-09-04T10:00:00.000Z'
    expect(formatDate(iso, 'en-GB')).toMatch(/4 Sept 2026|4 Sep 2026/)
    expect(formatDate(iso, 'en-US')).toMatch(/Sep 4, 2026/)
  })
})

describe('sleep', () => {
  it('resolves after the given delay', async () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    void sleep(100).then(spy)
    await vi.advanceTimersByTimeAsync(99)
    expect(spy).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(spy).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
