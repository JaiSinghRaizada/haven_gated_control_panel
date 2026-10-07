import * as React from 'react'
import { Check, Eye, EyeOff, LockKeyhole, MailCheck, ShieldCheck } from 'lucide-react'

import { Button, Input } from '@havengate/ui'

import type { AuthBranding } from '../types.ts'

function SecurityNote() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
      <ShieldCheck className="size-[14px]" />
      Protected by 256-bit military encryption
    </p>
  )
}

function HeroPanel({ branding }: { branding: AuthBranding }) {
  return (
    <section className="relative hidden min-h-svh w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 p-16 xl:flex">
      <img src={branding.heroImageSrc} alt={branding.heroImageAlt} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-auth-bg/75" />
      <div className="relative flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-[10px] bg-auth-accent text-[22px] font-extrabold text-auth-bg shadow-[var(--hg-auth-glow)]">H</div>
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold">HAVENGATE</span>
          <span className="font-mono text-[10px] font-semibold uppercase text-auth-accent">{branding.tagline}</span>
        </div>
      </div>
      <div className="relative flex flex-col gap-5">
        <h2 className="text-[40px] font-extrabold leading-tight">{branding.heroTitle}</h2>
        <p className="max-w-[500px] text-sm leading-[1.5] text-slate-400">{branding.heroDescription}</p>
      </div>
      <div className="relative flex gap-4">
        {branding.heroTags.map((label) => (
          <span key={label} className="flex items-center gap-1.5 rounded-md bg-auth-accent/[0.12] px-2.5 py-1.5 font-mono text-[10px] font-semibold text-auth-accent">
            <span className="size-1.5 rounded-full bg-auth-accent" />
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}

interface AuthCardProps {
  badge: string
  title: string
  description: string
  children: React.ReactNode
}

function AuthCard({ badge, title, description, children }: AuthCardProps) {
  return (
    <div className="relative flex w-full max-w-[480px] flex-col gap-7 rounded-3xl border border-auth-border bg-auth-panel/[0.8] p-8 shadow-[var(--hg-auth-card-shadow)] backdrop-blur-xl sm:p-12">
      <header className="flex flex-col gap-3">
        <span className="flex w-fit items-center gap-1.5 rounded-md bg-auth-accent/[0.12] px-2.5 py-1.5 font-mono text-[10px] font-semibold text-auth-accent">
          <span className="size-1.5 rounded-full bg-auth-accent" />
          {badge}
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold leading-tight text-auth-text">{title}</h1>
          <p className="text-sm leading-[1.5] text-auth-muted">{description}</p>
        </div>
      </header>
      {children}
    </div>
  )
}

function OtpCode({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex w-full gap-2.5">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          aria-label={`Digit ${index + 1}`}
          inputMode="numeric"
          maxLength={1}
          value={value[index] ?? ''}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, '')
            const next = value.split('')
            next[index] = digit
            onChange(next.join('').slice(0, 6))
          }}
          className={`h-[58px] min-w-0 flex-1 rounded-[10px] border bg-auth-input text-center font-mono text-2xl font-bold text-auth-text outline-none focus:border-auth-accent focus:ring-2 focus:ring-auth-accent/20 ${index === value.length ? 'border-auth-accent' : 'border-auth-border'}`}
        />
      ))}
    </div>
  )
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = React.useState(false)
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-400">
      {label}
      <span className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
        <Input type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className="h-[46px] rounded-[10px] border-auth-border bg-auth-input px-11 text-auth-text focus-visible:border-auth-accent focus-visible:ring-auth-accent/20" />
        <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white">
          {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      </span>
    </label>
  )
}

function Confirmation({ icon, title, description, action, onAction }: { icon: 'mail' | 'check'; title: string; description: string; action: string; onAction: () => void }) {
  return (
    <AuthCard badge={icon === 'mail' ? 'EMAIL SENT' : 'ACCESS RESTORED'} title={title} description={description}>
      <div className="flex h-28 w-full items-center justify-center rounded-2xl border border-auth-accent/30 bg-auth-accent/[0.12]">
        <div className="flex size-16 items-center justify-center rounded-full bg-auth-accent text-auth-bg shadow-[var(--hg-auth-glow)]">
          {icon === 'mail' ? <MailCheck className="size-7" /> : <Check className="size-7" />}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button onClick={onAction} className="h-12 w-full rounded-[10px] border-auth-accent bg-auth-accent font-bold text-auth-bg shadow-[var(--hg-auth-glow)] hover:bg-auth-accent-hover">{action}</Button>
        <SecurityNote />
      </div>
    </AuthCard>
  )
}

function AuthShell({ branding, children }: { branding: AuthBranding; children: React.ReactNode }) {
  const contentRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    contentRef.current?.focus()
  }, [children])

  return (
    <main className="flex min-h-svh w-full items-stretch overflow-hidden bg-auth-bg text-auth-text">
      <HeroPanel branding={branding} />
      <section ref={contentRef} tabIndex={-1} aria-live="polite" className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-6 py-10 outline-none focus-visible:ring-2 focus-visible:ring-auth-accent/50 xl:w-1/2">
        <div className="pointer-events-none absolute right-[-100px] top-20 size-[380px] rounded-full bg-auth-accent/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-100px] left-[-100px] size-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
        {children}
      </section>
    </main>
  )
}

export { AuthCard, AuthShell, Confirmation, OtpCode, PasswordField, SecurityNote }