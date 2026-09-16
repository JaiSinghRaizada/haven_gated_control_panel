import { createApiClient, createTokenStorage } from '@havengate/api'

export const tokenStorage = createTokenStorage('havengate.control.token')
export const refreshTokenStorage = createTokenStorage('havengate.control.refresh-token')

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  getToken: () => tokenStorage.get(),
  onUnauthorized: () => {
    tokenStorage.clear()
  },
})
