import * as React from 'react'
import { UserPlus } from 'lucide-react'
import { toast } from '@havengate/ui'

import { listStaffRequest, type StaffMembership } from '../../../../api/staff'

export interface UsersRolesCardProps {
  organisationId: string
}

const PREVIEW_COUNT = 3

const ROLE_LABELS: Record<StaffMembership['role'], string> = {
  ORG_ADMIN: 'Org admin',
  SITE_INCHARGE: 'Site admin',
  MAINTENANCE_HEAD: 'Maintenance head',
  SECURITY_SUPERVISOR: 'Security supervisor',
  GUARD: 'Guard',
  STAFF: 'Staff',
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function UsersRolesCard({ organisationId }: UsersRolesCardProps) {
  const [members, setMembers] = React.useState<StaffMembership[] | null>(null)
  const [total, setTotal] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true
    listStaffRequest(organisationId, 1, 20).then(
      (result) => {
        if (active) {
          setMembers(result.items)
          setTotal(result.meta.total)
        }
      },
      () => {
        if (active) setError('Could not load users.')
      },
    )
    return () => {
      active = false
    }
  }, [organisationId])

  const pendingCount = (members ?? []).filter((member) => member.status === 'INVITED').length
  const adminCount = (members ?? []).filter((member) => member.role === 'ORG_ADMIN').length

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">Users &amp; roles</p>
          <p className="text-xs text-muted-foreground">{members ? `${total} users · ${adminCount} admins · ${pendingCount} pending invites` : 'Loading users…'}</p>
        </div>
        <button type="button" onClick={() => toast('Inviting a user is coming soon')} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-[13px] font-semibold text-foreground">
          <UserPlus className="size-3.5" />
          Invite user
        </button>
      </div>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col">
          {(members ?? []).slice(0, PREVIEW_COUNT).map((member) => (
            <div key={member.id} className="flex items-center gap-3 border-b border-border py-3.5 last:border-b-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <p className="text-[10px] font-semibold text-muted-foreground">{initials(member.user.fullName)}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{member.user.fullName}</p>
                <p className="truncate text-[11px] text-muted-foreground">{member.user.email}</p>
              </div>
              <span className="rounded-md border border-border bg-muted px-2 py-1.5 text-[11px] text-foreground">{ROLE_LABELS[member.role]}</span>
            </div>
          ))}
          {members && members.length === 0 ? <p className="py-3 text-xs text-muted-foreground">No staff members yet.</p> : null}
        </div>
      )}

      {members && members.length > 0 ? (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">{pendingCount > 0 ? `Review ${pendingCount} pending invite${pendingCount === 1 ? '' : 's'}` : 'All invites accepted'}</p>
          <button type="button" onClick={() => toast('Managing access is coming soon')} className="text-xs font-semibold text-primary">
            Manage access →
          </button>
        </div>
      ) : null}
    </div>
  )
}

export { UsersRolesCard }
