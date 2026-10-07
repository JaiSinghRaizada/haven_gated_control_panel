import type { ManageTab, ManageTabKey } from './types'

export interface OrganizationTabsProps {
  tabs: ManageTab[]
  activeKey: ManageTabKey
  onChange: (key: ManageTabKey) => void
}

function OrganizationTabs({ tabs, activeKey, onChange }: OrganizationTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border px-6">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative px-3 py-3 text-[13px] font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
            {isActive ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
          </button>
        )
      })}
    </div>
  )
}

export { OrganizationTabs }
