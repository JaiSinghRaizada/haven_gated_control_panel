import { describe, expect, it, vi } from 'vitest'

import { ApiRequestError } from '@havengate/api'

import { createAuthService } from './service.ts'
import type { AuthUser } from './types.ts'

const user: AuthUser = {
  id: 'admin-1',
  email: 'admin@havengate.local',
  phone: '+15550000000',
  fullName: 'HavenGate Admin',
  avatarUrl: '',
  isSuperAdmin: true,
  isActive: true,
  hasPassword: true,
  createdAt: '2026-09-08T18:06:15.803Z',
  updatedAt: '2026-09-08T18:06:15.803Z',
}

function setup() {
  const post = vi.fn()
  const get = vi.fn()
  const tokenStorage = { get: vi.fn<() => string | null>(() => null), set: vi.fn(), clear: vi.fn() }
  const refreshTokenStorage = { get: vi.fn<() => string | null>(() => null), set: vi.fn(), clear: vi.fn() }
  const api = { public: { post }, protected: { get } } as never
  return { service: createAuthService({ api, tokenStorage, refreshTokenStorage }), post, get, tokenStorage, refreshTokenStorage }
}

describe('createAuthService.login', () => {
  it('posts credentials and maps the top-level token response', async () => {
    const { service, post, tokenStorage, refreshTokenStorage } = setup()
    post.mockResolvedValue({ accessToken: 'access-123', refreshToken: 'refresh-456', user })

    await expect(service.login({ email: user.email, password: 'ChangeMe123!' })).resolves.toEqual({
      user,
      tokens: { accessToken: 'access-123', refreshToken: 'refresh-456' },
    })
    expect(post).toHaveBeenCalledWith('/api/auth/login', {
      email: user.email,
      password: 'ChangeMe123!',
    })
    expect(tokenStorage.set).toHaveBeenCalledWith('access-123')
    expect(refreshTokenStorage.set).toHaveBeenCalledWith('refresh-456')
  })

  it('preserves invalid credentials errors', async () => {
    const { service, post } = setup()
    post.mockRejectedValue(new ApiRequestError({ kind: 'unauthorized', status: 401, message: 'Invalid Credentials' }))

    await expect(service.login({ email: user.email, password: 'wrong' })).rejects.toMatchObject({
      status: 401,
      message: 'Invalid Credentials',
    })
  })

  it('preserves deactivated account errors', async () => {
    const { service, post } = setup()
    post.mockRejectedValue(new ApiRequestError({ kind: 'http', status: 403, message: 'Account Deactivated' }))

    await expect(service.login({ email: user.email, password: 'ChangeMe123!' })).rejects.toMatchObject({
      status: 403,
      message: 'Account Deactivated',
    })
  })
})

describe('createAuthService.logout', () => {
  it('posts the refresh token and clears both cached tokens after 204', async () => {
    const { service, post, tokenStorage, refreshTokenStorage } = setup()
    refreshTokenStorage.get.mockReturnValue('refresh-456')
    post.mockResolvedValue(undefined)

    await expect(service.logout()).resolves.toBeUndefined()
    expect(post).toHaveBeenCalledWith('/api/auth/logout', { refreshToken: 'refresh-456' })
    expect(tokenStorage.clear).toHaveBeenCalledTimes(1)
    expect(refreshTokenStorage.clear).toHaveBeenCalledTimes(1)
  })
})

describe('createAuthService.forgotPassword', () => {
  it('posts the administrator email to the recovery endpoint', async () => {
    const { service, post } = setup()
    post.mockResolvedValue(undefined)

    await expect(service.forgotPassword('admin@havengate.local')).resolves.toBeUndefined()
    expect(post).toHaveBeenCalledWith('/api/auth/forgot-password', {
      email: 'admin@havengate.local',
    })
  })
})

describe('createAuthService.refresh', () => {
  it('posts the refresh token and stores the rotated tokens', async () => {
    const { service, post, tokenStorage, refreshTokenStorage } = setup()
    refreshTokenStorage.get.mockReturnValue('refresh-456')
    post.mockResolvedValue({ accessToken: 'access-789', refreshToken: 'refresh-999', user })

    await expect(service.refresh()).resolves.toBe('access-789')
    expect(post).toHaveBeenCalledWith('/api/auth/refresh', { refreshToken: 'refresh-456' })
    expect(tokenStorage.set).toHaveBeenCalledWith('access-789')
    expect(refreshTokenStorage.set).toHaveBeenCalledWith('refresh-999')
  })

  it('does not call the endpoint without a refresh token', async () => {
    const { service, post } = setup()

    await expect(service.refresh()).resolves.toBeNull()
    expect(post).not.toHaveBeenCalled()
  })
})

describe('createAuthService.me', () => {
  it('detects a cached session and loads the current user', async () => {
    const { service, get, tokenStorage } = setup()
    tokenStorage.get.mockReturnValue('access-123')
    get.mockResolvedValue(user)

    expect(service.hasSession()).toBe(true)
    await expect(service.me()).resolves.toEqual(user)
    expect(get).toHaveBeenCalledWith('/api/auth/me')
  })

  it('reports no cached session when the token is absent', () => {
    const { service } = setup()

    expect(service.hasSession()).toBe(false)
  })

  it('clears an expired cached token after unauthorized response', async () => {
    const { service, get, tokenStorage } = setup()
    tokenStorage.get.mockReturnValue('expired-token')
    get.mockRejectedValue(new ApiRequestError({ kind: 'unauthorized', status: 401, message: 'Unauthorized' }))

    await expect(service.me()).rejects.toMatchObject({ status: 401 })
    expect(tokenStorage.clear).toHaveBeenCalledTimes(1)
  })
})
