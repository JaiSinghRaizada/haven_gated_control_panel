import * as React from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

import { Button, FormField, Input } from '@havengate/ui'

import type { LoginCredentials } from '../types.ts'
import { isValidEmail } from '../validation.ts'

export interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => void | Promise<void>
  onForgot?: () => void
  loading?: boolean
  error?: string | null
}

function LoginForm({ onSubmit, onForgot, loading = false, error }: LoginFormProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailError, setEmailError] = React.useState<string | null>(null)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextEmailError = isValidEmail(email) ? null : 'Enter a valid work email.'
    const nextPasswordError = password ? null : 'Enter your password.'
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return
    void Promise.resolve(onSubmit?.({ email, password })).catch(() => undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <FormField label={<span className="text-slate-400">Work Email</span>} htmlFor="login-email" error={emailError} className="gap-2">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-auth-accent" />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-[10px] border-auth-accent/50 bg-white/[0.04] pl-11 text-auth-text shadow-[var(--hg-auth-glow)] placeholder:text-slate-500 focus-visible:border-auth-accent focus-visible:ring-auth-accent/20"
          />
        </div>
      </FormField>
      <FormField
        label={<span className="text-slate-400">Security Password</span>}
        htmlFor="login-password"
        error={error ?? passwordError}
        className="gap-2"
      >
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-auth-muted" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-[10px] border-auth-border bg-white/[0.04] px-11 text-auth-text placeholder:text-slate-500 focus-visible:border-auth-accent focus-visible:ring-auth-accent/20"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-auth-muted transition-colors hover:text-auth-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent/50"
          >
            {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </div>
      </FormField>
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <label className="flex cursor-pointer items-center gap-2 text-slate-400">
          <input type="checkbox" className="size-[18px] accent-auth-accent" defaultChecked />
          Remember this device
        </label>
        <button type="button" onClick={onForgot} className="font-semibold text-auth-accent hover:text-auth-accent-hover">
          Forgot password?
        </button>
      </div>
      <div className="flex flex-col gap-4 pt-1">
        <Button
          type="submit"
          loading={loading}
          className="h-11 w-full rounded-[10px] border-auth-accent bg-auth-accent text-auth-bg shadow-[var(--hg-auth-glow)] hover:bg-auth-accent-hover"
        >
          Sign In
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="size-[14px]" />
          Protected by 256-bit military encryption
        </p>
      </div>
    </form>
  )
}

export { LoginForm }
