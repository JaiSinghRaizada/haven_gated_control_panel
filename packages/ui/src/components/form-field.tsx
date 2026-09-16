import * as React from 'react'

import { cn } from '@havengate/ui/lib/utils'
import { Label } from '@havengate/ui/components/label'

export interface FormFieldProps extends React.ComponentProps<'div'> {
  label?: React.ReactNode
  htmlFor?: string
  hint?: React.ReactNode
  error?: React.ReactNode
  success?: React.ReactNode
  required?: boolean
}

function FormField({
  label,
  htmlFor,
  hint,
  error,
  success,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  const message = error ?? success ?? hint
  const messageClass = error
    ? 'text-destructive'
    : success
      ? 'text-success'
      : 'text-muted-foreground'

  return (
    <div data-slot="form-field" className={cn('flex flex-col gap-2', className)} {...props}>
      {label ? (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}
      {children}
      {message ? (
        <p
          data-slot="form-message"
          role={error ? 'alert' : undefined}
          className={cn('text-xs leading-tight', messageClass)}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
