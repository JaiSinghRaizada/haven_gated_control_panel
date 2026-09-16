import { createApiClient, createTokenStorage } from '@havengate/api'

export const tokenStorage = createTokenStorage('havengate.org.token')
export const refreshTokenStorage = createTokenStorage('havengate.org.refresh-token')

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  getToken: () => tokenStorage.get(),
  onUnauthorized: () => {
    tokenStorage.clear()
  },
})
