import { ApiRequestError } from './errors.ts'
import type {
  ApiClient,
  ApiClientOptions,
  ApiResult,
  ApiSurface,
  BodylessRequestOptions,
  HttpMethods,
  QueryParams,
  RequestOptions,
  SafeHttpMethods,
} from './types.ts'

const DEFAULT_TIMEOUT_MS = 30_000

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  if (/^https?:\/\//i.test(path)) {
    const absolute = new URL(path)
    appendQuery(absolute, query)
    return absolute.toString()
  }
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const url = new URL(path.replace(/^\/+/, ''), base)
  appendQuery(url, query)
  return url.toString()
}

function appendQuery(url: URL, query?: QueryParams) {
  if (!query) return
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null) url.searchParams.append(key, String(v))
      }
    } else {
      url.searchParams.set(key, String(value))
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isBodyInit(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams ||
    (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
  )
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined
  const contentType = response.headers.get('content-type') ?? ''
  const text = await response.text()
  if (!text) return undefined
  if (contentType.includes('application/json') || contentType.includes('+json')) {
    try {
      return JSON.parse(text) as unknown
    } catch (cause) {
      throw new ApiRequestError({
        kind: 'parse',
        status: response.status,
        message: 'Response was not valid JSON',
        url: response.url,
        cause,
      })
    }
  }
  return text
}

function defaultTransformResponse(body: unknown): unknown {
  if (isPlainObject(body) && 'success' in body && 'data' in body) return body.data
  return body
}

function toHttpError(response: Response, body: unknown, method: string): ApiRequestError {
  let message = response.statusText || `Request failed with status ${response.status}`
  let code: string | undefined
  let fieldErrors: Record<string, string[]> | undefined

  if (isPlainObject(body)) {
    const source = isPlainObject(body.error) ? body.error : body
    if (typeof source.message === 'string') message = source.message
    if (typeof source.code === 'string') code = source.code
    const fe = source.fieldErrors ?? source.errors
    if (isPlainObject(fe)) {
      fieldErrors = Object.fromEntries(
        Object.entries(fe).map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : [String(v)]]),
      )
    }
  } else if (typeof body === 'string' && body.trim()) {
    message = body
  }

  return new ApiRequestError({
    kind: response.status === 401 ? 'unauthorized' : 'http',
    status: response.status,
    message,
    code,
    fieldErrors,
    url: response.url,
    method,
    body,
  })
}

function withTimeout(
  signal: AbortSignal | undefined,
  timeoutMs: number,
): { signal: AbortSignal; clear: () => void; timedOut: () => boolean } {
  const controller = new AbortController()
  let timedOut = false
  const onAbort = () => controller.abort(signal?.reason)
  if (signal) {
    if (signal.aborted) onAbort()
    else signal.addEventListener('abort', onAbort, { once: true })
  }
  const timer =
    timeoutMs > 0
      ? setTimeout(() => {
          timedOut = true
          controller.abort()
        }, timeoutMs)
      : undefined
  return {
    signal: controller.signal,
    clear: () => {
      if (timer) clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    },
    timedOut: () => timedOut,
  }
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const {
    baseUrl,
    authMode = 'bearer',
    getToken,
    refreshToken,
    onUnauthorized,
    onError,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    defaultHeaders = {},
    transformResponse = defaultTransformResponse,
    fetch: fetchImpl = globalThis.fetch,
  } = options

  let refreshing: Promise<string | null | undefined> | null = null
  function refreshOnce() {
    if (!refreshToken) return Promise.resolve(null)
    refreshing ??= refreshToken().finally(() => {
      refreshing = null
    })
    return refreshing
  }

  async function execute<T>(
    path: string,
    init: RequestOptions,
    auth: boolean,
    tokenOverride?: string | null,
  ): Promise<T> {
    const method = init.method ?? 'GET'
    const url = buildUrl(baseUrl, path, init.query)
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...defaultHeaders,
      ...init.headers,
    }

    let body: BodyInit | undefined
    if (init.body !== undefined) {
      if (isBodyInit(init.body)) {
        body = init.body
      } else {
        headers['Content-Type'] ??= 'application/json'
        body = JSON.stringify(init.body)
      }
    }

    let credentials: RequestCredentials | undefined
    if (auth) {
      if (authMode === 'cookie') {
        credentials = 'include'
      } else {
        const token = tokenOverride !== undefined ? tokenOverride : await getToken?.()
        if (token) headers.Authorization = `Bearer ${token}`
      }
    }

    if (init.signal?.aborted) {
      throw new ApiRequestError({
        kind: 'aborted',
        status: 0,
        message: 'Request was aborted',
        url,
        method,
        cause: init.signal.reason,
      })
    }

    const timeout = withTimeout(init.signal, init.timeoutMs ?? timeoutMs)
    let response: Response
    try {
      response = await fetchImpl(url, { method, headers, body, credentials, signal: timeout.signal })
    } catch (cause) {
      timeout.clear()
      if (timeout.timedOut()) {
        throw new ApiRequestError({
          kind: 'timeout',
          status: 0,
          message: `Request timed out after ${init.timeoutMs ?? timeoutMs}ms`,
          url,
          method,
          cause,
        })
      }
      if (init.signal?.aborted) {
        throw new ApiRequestError({
          kind: 'aborted',
          status: 0,
          message: 'Request was aborted',
          url,
          method,
          cause,
        })
      }
      throw new ApiRequestError({
        kind: 'network',
        status: 0,
        message: 'Network error. Check your connection and try again.',
        url,
        method,
        cause,
      })
    }

    let parsed: unknown
    try {
      parsed = await readBody(response)
    } finally {
      timeout.clear()
    }

    if (!response.ok) throw toHttpError(response, parsed, method)

    return (init.raw ? parsed : transformResponse(parsed, response)) as T
  }

  async function run<T>(path: string, init: RequestOptions, auth: boolean): Promise<T> {
    try {
      try {
        return await execute<T>(path, init, auth)
      } catch (error) {
        const canRetry =
          auth &&
          authMode === 'bearer' &&
          refreshToken &&
          error instanceof ApiRequestError &&
          error.status === 401
        if (!canRetry) throw error
        const newToken = await refreshOnce()
        if (!newToken) throw error
        return await execute<T>(path, init, auth, newToken)
      }
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (auth && error.status === 401) onUnauthorized?.(error)
        onError?.(error)
      }
      throw error
    }
  }

  function makeMethods(auth: boolean): HttpMethods {
    return {
      request: (path, init) => run(path, init ?? {}, auth),
      get: (path, init) => run(path, { ...init, method: 'GET' }, auth),
      post: (path, body, init) => run(path, { ...init, method: 'POST', body }, auth),
      put: (path, body, init) => run(path, { ...init, method: 'PUT', body }, auth),
      patch: (path, body, init) => run(path, { ...init, method: 'PATCH', body }, auth),
      delete: (path, init) => run(path, { ...init, method: 'DELETE' }, auth),
    }
  }

  async function toResult<T>(promise: Promise<T>): Promise<ApiResult<T>> {
    try {
      return { ok: true, data: await promise, error: null }
    } catch (error) {
      if (error instanceof ApiRequestError) return { ok: false, data: null, error }
      throw error
    }
  }

  function makeSafe(m: HttpMethods): SafeHttpMethods {
    return {
      request: <T>(path: string, init?: RequestOptions) => toResult(m.request<T>(path, init)),
      get: <T>(path: string, init?: BodylessRequestOptions) => toResult(m.get<T>(path, init)),
      post: <T>(path: string, body?: unknown, init?: BodylessRequestOptions) =>
        toResult(m.post<T>(path, body, init)),
      put: <T>(path: string, body?: unknown, init?: BodylessRequestOptions) =>
        toResult(m.put<T>(path, body, init)),
      patch: <T>(path: string, body?: unknown, init?: BodylessRequestOptions) =>
        toResult(m.patch<T>(path, body, init)),
      delete: <T>(path: string, init?: BodylessRequestOptions) => toResult(m.delete<T>(path, init)),
    }
  }

  function makeSurface(auth: boolean): ApiSurface {
    const methods = makeMethods(auth)
    return { ...methods, safe: makeSafe(methods) }
  }

  const publicApi = makeSurface(false)
  const protectedApi = makeSurface(true)

  return {
    public: publicApi,
    protected: protectedApi,
    ...protectedApi,
  }
}