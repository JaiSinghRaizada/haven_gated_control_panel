import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@havengate/ui/lib/utils'

export interface SelectProps extends Omit<React.ComponentProps<'select'>, 'onChange'> {
  options: string[]
  onValueChange: (value: string) => void
}

function Select({ className, options, value, onValueChange, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(
          'flex h-11 w-full min-w-0 appearance-none rounded-md border border-input bg-surface py-2 pr-10 pl-3 text-base text-foreground transition-colors outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:text-muted-foreground md:text-sm',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { Select }
