import type { ApiError } from '@havengate/types'

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'parse' | 'unauthorized' | 'aborted'

export class ApiRequestError extends Error implements ApiError {
  readonly kind: ApiErrorKind
  readonly status: number
  readonly code?: string
  readonly fieldErrors?: Record<string, string[]>
  readonly url?: string
  readonly method?: string
  readonly body?: unknown

  constructor(init: {
    kind: ApiErrorKind
    status: number
    message: string
    code?: string
    fieldErrors?: Record<string, string[]>
    url?: string
    method?: string
    body?: unknown
    cause?: unknown
  }) {
    super(init.message, { cause: init.cause })
    this.name = 'ApiRequestError'
    this.kind = init.kind
    this.status = init.status
    this.code = init.code
    this.fieldErrors = init.fieldErrors
    this.url = init.url
    this.method = init.method
    this.body = init.body
  }

  get isUnauthorized() {
    return this.kind === 'unauthorized' || this.status === 401
  }
  get isForbidden() {
    return this.status === 403
  }
  get isNotFound() {
    return this.status === 404
  }
  get isValidation() {
    return this.status === 422 || (this.status === 400 && !!this.fieldErrors)
  }
  get isServer() {
    return this.status >= 500
  }
  get isNetwork() {
    return this.kind === 'network' || this.kind === 'timeout'
  }

  toJSON(): ApiError & { kind: ApiErrorKind } {
    return {
      kind: this.kind,
      status: this.status,
      message: this.message,
      code: this.code,
      fieldErrors: this.fieldErrors,
    }
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isApiRequestError(error)) return error.message || fallback
  if (error instanceof Error) return error.message || fallback
  if (typeof error === 'string') return error
  return fallback
}

export function getFieldErrors(error: unknown): Record<string, string[]> {
  return isApiRequestError(error) ? (error.fieldErrors ?? {}) : {}
}
