import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { getLocale, getTranslations } from "next-intl/server"
import { Inbox, ArrowRight, ChevronRight } from "lucide-react"
import { getUserData } from "@/features/auth/lib/queries"
import { ITransfer } from "@/features/transfer/lib/queries/get-transfers"

interface Props {
  transfers: ITransfer[]
}

export default async function TransferList({ transfers }: Props) {
  const { currency } = await getUserData()
  const locale = await getLocale()
  const t = await getTranslations("transfer")

  if (transfers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
        <Inbox className="size-8" />
        <p className="text-sm">{t("no_transfer")}</p>
      </div>
    )
  }

  return (
    <Card size="sm" className="data-[size=sm]:py-0">
      <CardContent className="divide-y divide-border/60">
        {transfers.map((transfer) => (
          <Link
            key={transfer.id}
            href={`/transfer/${transfer.id}`}
            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ArrowRight className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 truncate text-sm font-semibold">
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full text-[10px]"
                  style={{ backgroundColor: transfer.from_wallet.color }}
                >
                  {transfer.from_wallet.icon}
                </span>
                <span className="truncate">{transfer.from_wallet.name}</span>
                <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full text-[10px]"
                  style={{ backgroundColor: transfer.to_wallet.color }}
                >
                  {transfer.to_wallet.icon}
                </span>
                <span className="truncate">{transfer.to_wallet.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transfer.transfer_date, locale)}
              </p>
            </div>

            <p className="text-sm font-semibold">
              {formatCurrency(transfer.amount, currency)}
            </p>
            
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
