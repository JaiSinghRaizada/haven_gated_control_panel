import type { OrganisationStatus } from '../../../api/organizations'

export const STATUS_STYLES: Record<OrganisationStatus, { label: string; dot: string; bg: string; border: string; text: string }> = {
  ACTIVE: { label: 'Active', dot: 'bg-primary', bg: 'bg-primary/[0.08]', border: 'border-primary/30', text: 'text-primary' },
  SUSPENDED: { label: 'Suspended', dot: 'bg-destructive', bg: 'bg-destructive/[0.13]', border: 'border-destructive/20', text: 'text-destructive' },
}

function StatusBadge({ status }: { status: OrganisationStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <div className={`flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 ${style.bg} ${style.border}`}>
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      <p className={`font-mono text-[11px] font-semibold ${style.text}`}>{style.label}</p>
    </div>
  )
}

export { StatusBadge }
