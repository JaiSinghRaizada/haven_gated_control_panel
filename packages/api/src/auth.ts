export interface TokenStorage {
  get(): string | null
  set(token: string): void
  clear(): void
}

/**
 * Minimal token store backed by Web Storage. Falls back to memory when
 * storage is unavailable (SSR, privacy mode).
 */
export function createTokenStorage(
  key: string,
  storage: Storage | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined,
): TokenStorage {
  let memory: string | null = null
  return {
    get() {
      try {
        return storage ? storage.getItem(key) : memory
      } catch {
        return memory
      }
    },
    set(token) {
      memory = token
      try {
        storage?.setItem(key, token)
      } catch {
        // storage unavailable
      }
    },
    clear() {
      memory = null
      try {
        storage?.removeItem(key)
      } catch {
        // storage unavailable
      }
    },
  }
}
