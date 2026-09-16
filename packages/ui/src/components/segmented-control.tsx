import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

import { cn } from '@havengate/ui/lib/utils'

function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="segmented-control"
      className={cn('inline-flex items-center gap-3', className)}
      {...props}
    />
  )
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-control-item"
      className={cn(
        'inline-flex h-11 min-w-36 items-center justify-center rounded-md border border-input bg-surface px-6 text-sm font-semibold text-foreground transition-colors outline-none hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-primary',
        className,
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlItem }
