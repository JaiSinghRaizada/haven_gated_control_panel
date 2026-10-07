import * as React from 'react'

export interface ToastOptions {
  variant?: 'default' | 'success' | 'error'
  durationMs?: number
}

interface ToastItem {
  id: number
  message: string
  variant: NonNullable<ToastOptions['variant']>
}

let toasts: ToastItem[] = []
let listeners: Array<() => void> = []
let nextId = 1

function notify() {
  for (const listener of listeners) listener()
}

function dismiss(id: number) {
  toasts = toasts.filter((item) => item.id !== id)
  notify()
}

function toast(message: string, options: ToastOptions = {}) {
  const id = nextId++
  toasts = [...toasts, { id, message, variant: options.variant ?? 'default' }]
  notify()
  setTimeout(() => dismiss(id), options.durationMs ?? 3000)
}

function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return toasts
}

const VARIANT_STYLES: Record<ToastItem['variant'], string> = {
  default: 'border-border bg-card text-foreground',
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
}

function Toaster() {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  if (items.length === 0) return null

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${VARIANT_STYLES[item.variant]}`}
        >
          {item.message}
          <button type="button" onClick={() => dismiss(item.id)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

export { Toaster, toast }
