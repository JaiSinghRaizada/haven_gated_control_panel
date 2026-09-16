import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createApiClient } from './client.ts'
import { ApiRequestError } from './errors.ts'
import type { ApiClientOptions } from './types.ts'

type FetchMock = ReturnType<typeof vi.fn<typeof fetch>>

const BASE = 'https://api.test'

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  })
}

function text(body: string, init: ResponseInit = {}) {
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'text/plain' },
    ...init,
  })
}

function setup(options: Partial<ApiClientOptions> = {}) {
  const fetchMock: FetchMock = vi.fn()
  const api = createApiClient({ baseUrl: BASE, fetch: fetchMock, ...options })
  return { api, fetchMock }
}

/** Fresh Response per call — a Response body can only be read once. */
function always(factory: () => Response) {
  return () => Promise.resolve(factory())
}

function lastCall(fetchMock: FetchMock) {
  const call = fetchMock.mock.calls.at(-1)
  if (!call) throw new Error('fetch was not called')
  const [url, init] = call
  return { url: String(url), init: init as RequestInit, headers: new Headers(init?.headers) }
}

async function expectApiError(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    expect(error).toBeInstanceOf(ApiRequestError)
    return error as ApiRequestError
  }
  throw new Error('expected promise to reject')
}

describe('url + query', () => {
  it('joins base and path, normalising slashes', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({}))
    await api.get('/users')
    expect(lastCall(fetchMock).url).toBe(`${BASE}/users`)

    const other = setup({ baseUrl: `${BASE}/v1/` })
    other.fetchMock.mockResolvedValue(json({}))
    await other.api.get('users')
    expect(lastCall(other.fetchMock).url).toBe(`${BASE}/v1/users`)
  })

  it('uses absolute paths as-is', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({}))
    await api.get('https://other.test/x')
    expect(lastCall(fetchMock).url).toBe('https://other.test/x')
  })

  it('serialises query params, arrays, and skips null/undefined', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({}))
    await api.get('/items', {
      query: { page: 2, active: true, tag: ['a', 'b'], empty: undefined, nil: null },
    })
    const url = new URL(lastCall(fetchMock).url)
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('active')).toBe('true')
    expect(url.searchParams.getAll('tag')).toEqual(['a', 'b'])
    expect(url.searchParams.has('empty')).toBe(false)
    expect(url.searchParams.has('nil')).toBe(false)
  })
})

describe('request shaping', () => {
  it('JSON-encodes object bodies and sets content-type', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({}))
    await api.post('/users', { name: 'Nav' })
    const { init, headers } = lastCall(fetchMock)
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"name":"Nav"}')
    expect(headers.get('content-type')).toBe('application/json')
    expect(headers.get('accept')).toBe('application/json')
  })

  it('passes FormData through untouched without forcing content-type', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({}))
    const form = new FormData()
    form.append('file', 'x')
    await api.post('/upload', form)
    const { init, headers } = lastCall(fetchMock)
    expect(init.body).toBe(form)
    expect(headers.has('content-type')).toBe(false)
  })

  it('merges defaultHeaders then per-request headers', async () => {
    const { api, fetchMock } = setup({ defaultHeaders: { 'x-app': 'control', 'x-a': '1' } })
    fetchMock.mockResolvedValue(json({}))
    await api.get('/x', { headers: { 'x-a': '2' } })
    const { headers } = lastCall(fetchMock)
    expect(headers.get('x-app')).toBe('control')
    expect(headers.get('x-a')).toBe('2')
  })

  it('sends no body for GET/DELETE', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({}))
    await api.delete('/x')
    expect(lastCall(fetchMock).init.body).toBeUndefined()
  })
})

describe('auth: public vs protected', () => {
  it('public requests never send Authorization', async () => {
    const { api, fetchMock } = setup({ getToken: () => 'tok' })
    fetchMock.mockResolvedValue(json({}))
    await api.public.get('/login')
    expect(lastCall(fetchMock).headers.has('authorization')).toBe(false)
  })

  it('protected requests send Bearer token (root methods alias protected)', async () => {
    const { api, fetchMock } = setup({ getToken: async () => 'tok' })
    fetchMock.mockImplementation(always(() => json({})))
    await api.protected.get('/me')
    expect(lastCall(fetchMock).headers.get('authorization')).toBe('Bearer tok')
    await api.get('/me')
    expect(lastCall(fetchMock).headers.get('authorization')).toBe('Bearer tok')
  })

  it('omits Authorization when token is missing', async () => {
    const { api, fetchMock } = setup({ getToken: () => null })
    fetchMock.mockResolvedValue(json({}))
    await api.get('/me')
    expect(lastCall(fetchMock).headers.has('authorization')).toBe(false)
  })

  it('cookie mode sets credentials: include and no header', async () => {
    const { api, fetchMock } = setup({ authMode: 'cookie', getToken: () => 'tok' })
    fetchMock.mockImplementation(always(() => json({})))
    await api.get('/me')
    const { init, headers } = lastCall(fetchMock)
    expect(init.credentials).toBe('include')
    expect(headers.has('authorization')).toBe(false)

    await api.public.get('/x')
    expect(lastCall(fetchMock).init.credentials).toBeUndefined()
  })
})

describe('refresh on 401', () => {
  it('refreshes once and retries with the new token', async () => {
    const refreshToken = vi.fn(async () => 'new')
    const onUnauthorized = vi.fn()
    const { api, fetchMock } = setup({ getToken: () => 'old', refreshToken, onUnauthorized })
    fetchMock
      .mockResolvedValueOnce(json({ message: 'expired' }, { status: 401 }))
      .mockResolvedValueOnce(json({ id: 1 }))

    await expect(api.get('/me')).resolves.toEqual({ id: 1 })
    expect(refreshToken).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(lastCall(fetchMock).headers.get('authorization')).toBe('Bearer new')
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('gives up when refresh returns null and calls onUnauthorized once', async () => {
    const refreshToken = vi.fn(async () => null)
    const onUnauthorized = vi.fn()
    const { api, fetchMock } = setup({ getToken: () => 'old', refreshToken, onUnauthorized })
    fetchMock.mockResolvedValue(json({ message: 'nope' }, { status: 401 }))

    const error = await expectApiError(api.get('/me'))
    expect(error.status).toBe(401)
    expect(error.kind).toBe('unauthorized')
    expect(error.isUnauthorized).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(onUnauthorized).toHaveBeenCalledTimes(1)
  })

  it('throws after retry if the retried request is also 401', async () => {
    const refreshToken = vi.fn(async () => 'new')
    const onUnauthorized = vi.fn()
    const { api, fetchMock } = setup({ getToken: () => 'old', refreshToken, onUnauthorized })
    fetchMock.mockImplementation(always(() => json({}, { status: 401 })))

    await expectApiError(api.get('/me'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(refreshToken).toHaveBeenCalledTimes(1)
    expect(onUnauthorized).toHaveBeenCalledTimes(1)
  })

  it('de-duplicates concurrent refreshes', async () => {
    let resolveRefresh!: (v: string) => void
    const refreshToken = vi.fn(
      () =>
        new Promise<string>((r) => {
          resolveRefresh = r
        }),
    )
    const { api, fetchMock } = setup({ getToken: () => 'old', refreshToken })
    fetchMock.mockImplementation(async (_url, init) => {
      const auth = new Headers(init?.headers).get('authorization')
      return auth === 'Bearer new' ? json({ ok: 1 }) : json({}, { status: 401 })
    })

    const a = api.get('/a')
    const b = api.get('/b')
    await vi.waitFor(() => expect(refreshToken).toHaveBeenCalledTimes(1))
    resolveRefresh('new')

    await expect(Promise.all([a, b])).resolves.toEqual([{ ok: 1 }, { ok: 1 }])
    expect(refreshToken).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('does not refresh for public requests or without refreshToken', async () => {
    const refreshToken = vi.fn(async () => 'new')
    const onUnauthorized = vi.fn()
    const { api, fetchMock } = setup({ getToken: () => 'old', refreshToken, onUnauthorized })
    fetchMock.mockResolvedValue(json({}, { status: 401 }))

    await expectApiError(api.public.post('/login', {}))
    expect(refreshToken).not.toHaveBeenCalled()
    expect(onUnauthorized).not.toHaveBeenCalled()

    const plain = setup({ getToken: () => 'old' })
    plain.fetchMock.mockResolvedValue(json({}, { status: 401 }))
    await expectApiError(plain.api.get('/me'))
    expect(plain.fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('response handling', () => {
  it('returns undefined for 204 / empty bodies', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    await expect(api.delete('/x')).resolves.toBeUndefined()
    fetchMock.mockResolvedValueOnce(
      new Response('', { status: 200, headers: { 'content-type': 'application/json' } }),
    )
    await expect(api.get('/x')).resolves.toBeUndefined()
  })

  it('unwraps { success, data } envelopes by default', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({ success: true, data: { id: 7 }, message: 'ok' }))
    await expect(api.get('/x')).resolves.toEqual({ id: 7 })
  })

  it('returns non-envelope JSON untouched', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({ id: 7 }))
    await expect(api.get('/x')).resolves.toEqual({ id: 7 })
  })

  it('raw: true bypasses transform', async () => {
    const { api, fetchMock } = setup()
    const body = { success: true, data: 1 }
    fetchMock.mockResolvedValue(json(body))
    await expect(api.get('/x', { raw: true })).resolves.toEqual(body)
  })

  it('supports a custom transformResponse', async () => {
    const { api, fetchMock } = setup({
      transformResponse: (b) => (b as { result: unknown }).result,
    })
    fetchMock.mockResolvedValue(json({ result: 'yes' }))
    await expect(api.get('/x')).resolves.toBe('yes')
  })

  it('returns text for non-JSON content types', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(text('pong'))
    await expect(api.get('/ping')).resolves.toBe('pong')
  })

  it('throws kind=parse on malformed JSON', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(
      new Response('{not json', { status: 200, headers: { 'content-type': 'application/json' } }),
    )
    const error = await expectApiError(api.get('/x'))
    expect(error.kind).toBe('parse')
  })
})

describe('error handling', () => {
  it('maps HTTP errors with message, code and fieldErrors', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(
      json(
        {
          message: 'Validation failed',
          code: 'VALIDATION',
          fieldErrors: { email: ['Invalid'], name: 'Required' },
        },
        { status: 422 },
      ),
    )
    const error = await expectApiError(api.post('/users', {}))
    expect(error.kind).toBe('http')
    expect(error.status).toBe(422)
    expect(error.message).toBe('Validation failed')
    expect(error.code).toBe('VALIDATION')
    expect(error.fieldErrors).toEqual({ email: ['Invalid'], name: ['Required'] })
    expect(error.isValidation).toBe(true)
    expect(error.method).toBe('POST')
  })

  it('reads nested { error: {...} } envelopes and "errors" alias', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(
      json(
        { success: false, error: { message: 'Bad', code: 'BAD', errors: { x: ['no'] } } },
        { status: 400 },
      ),
    )
    const error = await expectApiError(api.get('/x'))
    expect(error.message).toBe('Bad')
    expect(error.code).toBe('BAD')
    expect(error.fieldErrors).toEqual({ x: ['no'] })
  })

  it('uses plain-text bodies as the message, statusText as fallback', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValueOnce(text('Gateway exploded', { status: 502 }))
    let error = await expectApiError(api.get('/x'))
    expect(error.message).toBe('Gateway exploded')
    expect(error.isServer).toBe(true)

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404, statusText: 'Not Found' }))
    error = await expectApiError(api.get('/x'))
    expect(error.message).toBe('Not Found')
    expect(error.isNotFound).toBe(true)
  })

  it('maps fetch rejections to kind=network', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    const error = await expectApiError(api.get('/x'))
    expect(error.kind).toBe('network')
    expect(error.status).toBe(0)
    expect(error.isNetwork).toBe(true)
    expect(error.cause).toBeInstanceOf(TypeError)
  })

  it('maps caller aborts to kind=aborted (in-flight)', async () => {
    const { api, fetchMock } = setup()
    const controller = new AbortController()
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
        }),
    )
    const promise = expectApiError(api.get('/x', { signal: controller.signal }))
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    controller.abort()
    const error = await promise
    expect(error.kind).toBe('aborted')
  })

  it('short-circuits already-aborted signals without calling fetch', async () => {
    const { api, fetchMock } = setup()
    const controller = new AbortController()
    controller.abort()
    const error = await expectApiError(api.get('/x', { signal: controller.signal }))
    expect(error.kind).toBe('aborted')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('calls onError for every failure and toJSON is serialisable', async () => {
    const onError = vi.fn()
    const { api, fetchMock } = setup({ onError })
    fetchMock.mockResolvedValue(json({ message: 'boom' }, { status: 500 }))
    const error = await expectApiError(api.get('/x'))
    expect(onError).toHaveBeenCalledWith(error)
    expect(error.toJSON()).toEqual({
      kind: 'http',
      status: 500,
      message: 'boom',
      code: undefined,
      fieldErrors: undefined,
    })
  })
})

describe('timeout', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('aborts after timeoutMs with kind=timeout', async () => {
    const { api, fetchMock } = setup({ timeoutMs: 1000 })
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
        }),
    )
    const promise = expectApiError(api.get('/slow'))
    await vi.advanceTimersByTimeAsync(1000)
    const error = await promise
    expect(error.kind).toBe('timeout')
    expect(error.message).toContain('1000ms')
  })

  it('per-request timeoutMs overrides the default', async () => {
    const { api, fetchMock } = setup({ timeoutMs: 60_000 })
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
        }),
    )
    const promise = expectApiError(api.get('/slow', { timeoutMs: 50 }))
    await vi.advanceTimersByTimeAsync(50)
    expect((await promise).kind).toBe('timeout')
  })

  it('clears the timer on success', async () => {
    const { api, fetchMock } = setup({ timeoutMs: 1000 })
    fetchMock.mockResolvedValue(json({ ok: true }))
    await expect(api.get('/fast')).resolves.toEqual({ ok: true })
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('safe surface', () => {
  it('returns ok result on success', async () => {
    const { api, fetchMock } = setup()
    fetchMock.mockResolvedValue(json({ id: 1 }))
    const result = await api.safe.get<{ id: number }>('/x')
    expect(result).toEqual({ ok: true, data: { id: 1 }, error: null })
    if (result.ok) expect(result.data.id).toBe(1)
  })

  it('returns error result instead of throwing', async () => {
    const onError = vi.fn()
    const { api, fetchMock } = setup({ onError })
    fetchMock.mockResolvedValue(json({ message: 'nope' }, { status: 403 }))
    const result = await api.safe.post('/x', {})
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(ApiRequestError)
      expect(result.error.isForbidden).toBe(true)
    }
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('exists on both public and protected surfaces', async () => {
    const { api, fetchMock } = setup({ getToken: () => 'tok' })
    fetchMock.mockImplementation(always(() => json({})))
    await api.public.safe.get('/x')
    expect(lastCall(fetchMock).headers.has('authorization')).toBe(false)
    await api.protected.safe.get('/x')
    expect(lastCall(fetchMock).headers.get('authorization')).toBe('Bearer tok')
  })

  it('rethrows non-API errors', async () => {
    const { api } = setup({
      getToken: () => {
        throw new Error('storage broken')
      },
    })
    await expect(api.safe.get('/x')).rejects.toThrow('storage broken')
  })
})
