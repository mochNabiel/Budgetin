import { ChevronRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { cn } from "@/shared/utils"
import type { IWalletTransactionActivity } from "../../lib/queries/get-wallet-activity"

type Props = {
  item: IWalletTransactionActivity
  currency: string
  locale: string
}

export default function ActivityTransactionRow({
  item,
  currency,
  locale,
}: Props) {
  const isIncome = item.type === "income"

  return (
    <Link
      href={`/transaction/${item.id}`}
      className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
        style={{ backgroundColor: `${item.category.color}40` }}
      >
        {item.category.icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {item.notes || item.category.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(item.transaction_date, locale)} · Transaction
        </p>
      </div>

      <p
        className={cn(
          "text-sm font-semibold",
          isIncome ? "text-chart-2" : "text-destructive"
        )}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(item.amount, currency)}
      </p>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}

