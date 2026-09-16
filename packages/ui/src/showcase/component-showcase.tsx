import { useState } from 'react'

import { Button } from '@havengate/ui/components/button'
import { Checkbox } from '@havengate/ui/components/checkbox'
import { FormField } from '@havengate/ui/components/form-field'
import { Input } from '@havengate/ui/components/input'
import { Label } from '@havengate/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@havengate/ui/components/radio-group'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@havengate/ui/components/segmented-control'
import { cn } from '@havengate/ui/lib/utils'

export interface ComponentShowcaseProps {
  title?: string
  className?: string
}

function ComponentShowcase({ title = 'Actions & Inputs', className }: ComponentShowcaseProps) {
  const [role, setRole] = useState('tenant')

  return (
    <div className={cn('mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10', className)}>
      <header>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">Core reusable component sets</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold">Button / Button</h2>
        <div className="flex flex-wrap gap-5">
          <Button className="min-w-44">Primary</Button>
          <Button variant="secondary" className="min-w-44">
            Secondary
          </Button>
          <Button variant="destructive" className="min-w-44">
            Destructive
          </Button>
          <Button disabled className="min-w-44">
            Disabled
          </Button>
          <Button loading className="min-w-44">
            Loading
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Type=Primary, Secondary, Destructive · State=Default, Hover, Pressed, Focus, Disabled,
          Loading
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-base font-bold">Input / Text field</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Flat number" htmlFor="flat-default">
            <Input id="flat-default" defaultValue="4B" />
          </FormField>
          <FormField label="Flat number" htmlFor="flat-focus" hint="Focus to see the ring">
            <Input id="flat-focus" defaultValue="4B" />
          </FormField>
          <FormField label="Flat number" htmlFor="flat-error" error="Enter a valid value">
            <Input id="flat-error" state="error" placeholder="Enter value" />
          </FormField>
          <FormField label="Flat number" htmlFor="flat-success" success="Looks good">
            <Input id="flat-success" state="success" defaultValue="4B" />
          </FormField>
          <FormField label="Flat number" htmlFor="flat-disabled">
            <Input id="flat-disabled" defaultValue="4B" disabled />
          </FormField>
          <FormField label="Flat number" htmlFor="flat-readonly">
            <Input id="flat-readonly" defaultValue="4B" readOnly />
          </FormField>
        </div>
        <p className="text-xs text-muted-foreground">
          State=Default, Focus, Filled, Error, Success, Disabled, Read only
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-base font-bold">Control / Selection</h2>
        <SegmentedControl type="single" value={role} onValueChange={(v) => v && setRole(v)}>
          <SegmentedControlItem value="tenant">Tenant</SegmentedControlItem>
          <SegmentedControlItem value="leaseholder">Leaseholder</SegmentedControlItem>
        </SegmentedControl>

        <div className="flex flex-wrap items-center gap-12">
          <div className="flex items-center gap-3">
            <Checkbox id="ack" defaultChecked />
            <Label htmlFor="ack" className="font-normal">
              Acknowledgement
            </Label>
          </div>
          <RadioGroup defaultValue="notifications" className="flex gap-6">
            <div className="flex items-center gap-3">
              <RadioGroupItem id="notif" value="notifications" />
              <Label htmlFor="notif" className="font-normal">
                Notifications
              </Label>
            </div>
          </RadioGroup>
        </div>
      </section>
    </div>
  )
}

export { ComponentShowcase }
