import { describe, expect, it } from 'vitest'

import { createTokenStorage } from './auth.ts'

function fakeStorage(overrides: Partial<Storage> = {}): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
    ...overrides,
  }
}

describe('createTokenStorage', () => {
  it('round-trips through the provided storage', () => {
    const storage = fakeStorage()
    const tokens = createTokenStorage('k', storage)
    expect(tokens.get()).toBeNull()
    tokens.set('abc')
    expect(tokens.get()).toBe('abc')
    expect(storage.getItem('k')).toBe('abc')
    tokens.clear()
    expect(tokens.get()).toBeNull()
    expect(storage.getItem('k')).toBeNull()
  })

  it('falls back to memory when storage is undefined', () => {
    const tokens = createTokenStorage('k', undefined)
    tokens.set('mem')
    expect(tokens.get()).toBe('mem')
    tokens.clear()
    expect(tokens.get()).toBeNull()
  })

  it('falls back to memory when storage throws', () => {
    const throwing = fakeStorage({
      getItem: () => {
        throw new Error('quota')
      },
      setItem: () => {
        throw new Error('quota')
      },
    })
    const tokens = createTokenStorage('k', throwing)
    tokens.set('mem')
    expect(tokens.get()).toBe('mem')
  })
})
