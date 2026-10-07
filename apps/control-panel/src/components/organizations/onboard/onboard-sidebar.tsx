import { Check } from 'lucide-react'

import { SETUP_STEPS, type WizardStep } from './types'
import { initials } from './validation'

export interface OnboardSidebarProps {
  step: WizardStep
  onGoToStep: (step: WizardStep) => void
  userName?: string
  userEmail?: string
}

function OnboardSidebar({ step, onGoToStep, userName, userEmail }: OnboardSidebarProps) {
  return (
    <div className="flex w-[310px] shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar px-7 py-8">
      <div className="flex flex-col gap-[72px]">
        <div className="flex flex-col gap-3">
          <div className="flex size-10 items-center justify-center rounded-[10px] bg-primary text-xl font-extrabold text-primary-foreground">H</div>
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-bold text-sidebar-foreground">HAVENGATE</p>
            <p className="font-mono text-[9px] font-semibold uppercase text-primary">Cpanel · Org Setup</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-mono text-[10px] text-primary">ORGANIZATION ONBOARDING</p>
          <div className="flex flex-col gap-1">
            {SETUP_STEPS.map((setupStep) => {
              const active = setupStep.number === step
              const completed = setupStep.number < step
              return (
                <button
                  key={setupStep.number}
                  type="button"
                  onClick={completed ? () => onGoToStep(setupStep.number) : undefined}
                  disabled={!completed && !active}
                  aria-current={active ? 'step' : undefined}
                  className={`flex w-full items-center gap-3 rounded-[10px] border px-3 py-3 text-left ${active ? 'border-primary/30 bg-accent' : 'border-transparent hover:enabled:bg-sidebar-accent/40'}`}
                >
                  <span className={`flex size-[30px] shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${active ? 'bg-primary text-primary-foreground' : completed ? 'bg-primary/80 text-primary-foreground' : 'border border-border bg-muted text-muted-foreground'}`}>
                    {completed ? <Check className="size-4" /> : setupStep.number}
                  </span>
                  <span className={`text-sm ${active ? 'font-semibold text-sidebar-foreground' : 'font-medium text-muted-foreground'}`}>{setupStep.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-accent">
          <p className="text-xs font-bold text-accent-foreground">{initials(userName, userEmail)}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-[13px] font-semibold text-sidebar-foreground">{userName ?? userEmail ?? 'Administrator'}</p>
          <p className="font-mono text-[10px] text-muted-foreground">Organization Admin</p>
        </div>
      </div>
    </div>
  )
}

export { OnboardSidebar }
