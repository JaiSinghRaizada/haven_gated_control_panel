import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@havengate/ui/lib/utils'

const inputVariants = cva(
  'flex h-11 w-full min-w-0 rounded-md border bg-surface px-3 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:text-muted-foreground read-only:bg-muted read-only:focus-visible:border-input read-only:focus-visible:ring-0 md:text-sm',
  {
    variants: {
      state: {
        default:
          'border-input focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15',
        error:
          'border-destructive focus-visible:border-destructive focus-visible:ring-[3px] focus-visible:ring-destructive/15',
        success:
          'border-success focus-visible:border-success focus-visible:ring-[3px] focus-visible:ring-success/15',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

export interface InputProps
  extends React.ComponentProps<'input'>,
    VariantProps<typeof inputVariants> {}

function Input({ className, type = 'text', state, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-state={state ?? 'default'}
      aria-invalid={state === 'error' ? true : props['aria-invalid']}
      className={cn(inputVariants({ state, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
