import { createApiClient, createTokenStorage } from '@havengate/api'

export const tokenStorage = createTokenStorage('havengate.control.token')
export const refreshTokenStorage = createTokenStorage('havengate.control.refresh-token')

let refreshHandler: (() => Promise<string | null>) | undefined

export function registerRefreshHandler(handler: () => Promise<string | null>) {
  refreshHandler = handler
}

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  getToken: () => tokenStorage.get(),
  refreshToken: () => refreshHandler?.() ?? Promise.resolve(null),
  onUnauthorized: () => {
    tokenStorage.clear()
    refreshTokenStorage.clear()
  },
})
