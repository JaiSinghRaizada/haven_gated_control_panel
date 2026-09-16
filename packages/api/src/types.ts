import type { ApiRequestError } from './errors.ts'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue | QueryValue[]>

export type AuthMode = 'bearer' | 'cookie'

export interface ApiClientOptions {
  baseUrl: string
  /** How protected requests authenticate. `bearer` sends `Authorization` header; `cookie` sends credentials. */
  authMode?: AuthMode
  /** Returns the current access token (bearer mode). */
  getToken?: () => string | null | undefined | Promise<string | null | undefined>
  /** Called once on 401 for a protected request; return a new token to retry, or null to give up. */
  refreshToken?: () => Promise<string | null | undefined>
  /** Called when a protected request ends up unauthorized after any refresh attempt. */
  onUnauthorized?: (error: ApiRequestError) => void
  /** Called for every error thrown by the client (logging, toasts, etc). */
  onError?: (error: ApiRequestError) => void
  /** Default request timeout in ms. `0` disables. Default 30000. */
  timeoutMs?: number
  /** Headers sent with every request. */
  defaultHeaders?: Record<string, string>
  /**
   * Normalise a successful JSON body before it is returned.
   * Default unwraps `{ success, data }` envelopes and returns raw bodies otherwise.
   */
  transformResponse?: (body: unknown, response: Response) => unknown
  /** Provide `fetch` (tests, SSR). Defaults to global fetch. */
  fetch?: typeof fetch
}

export interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  query?: QueryParams
  headers?: Record<string, string>
  signal?: AbortSignal
  /** Per-request timeout override. */
  timeoutMs?: number
  /** Skip default response transform for this call. */
  raw?: boolean
}

export type BodylessRequestOptions = Omit<RequestOptions, 'method' | 'body'>
export type BodyRequestOptions = Omit<RequestOptions, 'method'>

export type ApiResult<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: ApiRequestError }

export interface HttpMethods {
  request<T>(path: string, options?: RequestOptions): Promise<T>
  get<T>(path: string, options?: BodylessRequestOptions): Promise<T>
  post<T>(path: string, body?: unknown, options?: BodylessRequestOptions): Promise<T>
  put<T>(path: string, body?: unknown, options?: BodylessRequestOptions): Promise<T>
  patch<T>(path: string, body?: unknown, options?: BodylessRequestOptions): Promise<T>
  delete<T>(path: string, options?: BodylessRequestOptions): Promise<T>
}

export interface SafeHttpMethods {
  request<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>>
  get<T>(path: string, options?: BodylessRequestOptions): Promise<ApiResult<T>>
  post<T>(path: string, body?: unknown, options?: BodylessRequestOptions): Promise<ApiResult<T>>
  put<T>(path: string, body?: unknown, options?: BodylessRequestOptions): Promise<ApiResult<T>>
  patch<T>(path: string, body?: unknown, options?: BodylessRequestOptions): Promise<ApiResult<T>>
  delete<T>(path: string, options?: BodylessRequestOptions): Promise<ApiResult<T>>
}

export interface ApiSurface extends HttpMethods {
  /** Same methods, but resolve to `{ ok, data, error }` instead of throwing. */
  safe: SafeHttpMethods
}

export interface ApiClient {
  /** Requests that do NOT attach auth (login, register, public listings). */
  public: ApiSurface
  /** Requests that attach auth and handle 401 / token refresh. */
  protected: ApiSurface
  /** Alias of `protected` for ergonomic default usage. */
  get: ApiSurface['get']
  post: ApiSurface['post']
  put: ApiSurface['put']
  patch: ApiSurface['patch']
  delete: ApiSurface['delete']
  request: ApiSurface['request']
  safe: ApiSurface['safe']
}
