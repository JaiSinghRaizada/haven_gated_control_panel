import { FormField, Select } from '@havengate/ui'

import { CURRENCY_OPTIONS, LANGUAGE_OPTIONS, PORTFOLIO_TYPES } from './constants'
import { useFocusOnMount } from './hooks'
import type { OnboardForm, UpdateField } from './types'

export interface Step2OperatingProfileProps {
  form: OnboardForm
  updateField: UpdateField
}

function Step2OperatingProfile({ form, updateField }: Step2OperatingProfileProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>()
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] text-primary">STEP 2 OF 4 · OPERATIONS</p>
        <h1 ref={headingRef} tabIndex={-1} className="rounded text-[32px] font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          Define your operating profile
        </h1>
        <p className="text-sm text-muted-foreground">A few portfolio details help HavenGate configure sensible defaults. You can refine them per site later.</p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-[0px_18px_20px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-2.5">
          <p className="text-lg text-foreground">What does your organization manage?</p>
          <div className="flex flex-col gap-2.5">
            {PORTFOLIO_TYPES.map((option) => {
              const selected = option.value === form.portfolioType
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('portfolioType', option.value)}
                  className={`flex flex-col gap-2 rounded-[10px] border px-4 py-3.5 text-left ${selected ? 'border-primary bg-accent' : 'border-border bg-muted hover:border-border/70'}`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`size-[22px] ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
                    {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
                  </div>
                  <p className="text-base text-foreground">{option.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <FormField label="Default language" htmlFor="org-language" className="flex-1">
            <Select id="org-language" value={form.defaultLanguage} onValueChange={(value) => updateField('defaultLanguage', value)} options={LANGUAGE_OPTIONS} className="h-[42px] rounded-[10px] border-border bg-muted" />
          </FormField>
          <FormField label="Default currency" htmlFor="org-currency" className="flex-1">
            <Select id="org-currency" value={form.defaultCurrency} onValueChange={(value) => updateField('defaultCurrency', value)} options={CURRENCY_OPTIONS} className="h-[42px] rounded-[10px] border-border bg-muted" />
          </FormField>
        </div>

        <div className="rounded-[10px] border border-primary/30 bg-primary/[0.08] px-3 py-2.5 text-xs">
          <p className="leading-relaxed text-foreground/80">These settings establish organization-wide defaults. Site administrators can override local timezone, currency, and language.</p>
        </div>
      </div>
    </>
  )
}

export { Step2OperatingProfile }
