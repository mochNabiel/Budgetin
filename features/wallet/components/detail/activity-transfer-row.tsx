import { ArrowRight, ChevronRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { cn } from "@/shared/utils"
import type { IWalletTransferActivity } from "../../lib/queries/get-wallet-activity"

type Props = {
  item: IWalletTransferActivity
  currency: string
  locale: string
}

export default function ActivityTransferRow({
  item,
  currency,
  locale,
}: Props) {
  const isOut = item.kind === "out"

  return (
    <Link
      href={`/transfer/${item.id}`}
      className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-2">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[10px]"
          style={{ backgroundColor: item.from_wallet.color }}
        >
          {item.from_wallet.icon}
        </span>
        <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[10px]"
          style={{ backgroundColor: item.to_wallet.color }}
        >
          {item.to_wallet.icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {item.from_wallet.name} → {item.to_wallet.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(item.transfer_date, locale)} · Transfer
        </p>
      </div>

      <p
        className={cn(
          "text-sm font-semibold",
          isOut ? "text-destructive" : "text-chart-2"
        )}
      >
        {isOut ? "-" : "+"}
        {formatCurrency(item.amount, currency)}
      </p>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}

