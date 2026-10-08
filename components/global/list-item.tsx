import { ChevronRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { cn } from "@/shared/utils"

type ListItemTone = "default" | "positive" | "negative"

type Props = {
  href: string
  icon: React.ReactNode
  iconClassName?: string
  title: React.ReactNode
  description?: React.ReactNode
  amount?: React.ReactNode
  tone?: ListItemTone
  className?: string
}

const toneClasses: Record<ListItemTone, string> = {
  default: "text-foreground",
  positive: "text-chart-2",
  negative: "text-destructive",
}

export function ListItem({
  href,
  icon,
  iconClassName,
  title,
  description,
  amount,
  tone = "default",
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40",
        className
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full text-xl",
          iconClassName
        )}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{title}</p>
        {description ? (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {amount ? (
        <p className={cn("text-sm font-semibold", toneClasses[tone])}>
          {amount}
        </p>
      ) : null}

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}

