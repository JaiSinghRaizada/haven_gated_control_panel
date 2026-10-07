export interface OverviewPageProps {
  userName?: string
}

function OverviewPage({ userName }: OverviewPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-8 p-10">
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] text-primary">SUPERADMIN DASHBOARD</p>
        <h1 className="text-[32px] font-bold text-foreground">{userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Overview'}</h1>
        <p className="text-sm text-muted-foreground">A platform-wide summary across every organization will live here.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-16 text-center">
        <p className="text-sm text-muted-foreground">Nothing to summarize yet. Start by onboarding an organization.</p>
      </div>
    </div>
  )
}

export { OverviewPage }
