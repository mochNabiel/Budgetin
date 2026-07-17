import { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  icon?: ReactNode
  action?: ReactNode
}

export function SectionHeader({ title, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-1">
      <div className="flex items-center gap-1">
        {icon}

        <h2 className="font-semibold tracking-wide text-lg">{title}</h2>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
