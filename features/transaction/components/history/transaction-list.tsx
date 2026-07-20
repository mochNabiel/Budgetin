import { getUserData } from "@/features/auth/lib/queries"
import { getLocale, getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { cn } from "@/shared/utils"
import { ITransaction } from "@/features/transaction/lib/queries/get-transactions"
import { Inbox } from "lucide-react"

interface Props {
  transactions: ITransaction[]
}

export default async function TransactionList({ transactions }: Props) {
  const { currency } = await getUserData()
  const locale = await getLocale()
  const t = await getTranslations("transaction")

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
        <Inbox className="size-8" />
        <p className="text-sm">{t("no_transaction")}</p>
      </div>
    )
  }

  return (
    <Card size="sm" className="data-[size=sm]:py-0">
      <CardContent className="divide-y divide-border/60">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income"

          return (
            <Link
              key={transaction.id}
              href={`/transaction/${transaction.id}`}
              className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: `${transaction.category.color}40` }}
              >
                {transaction.category.icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {transaction.notes || transaction.category.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.wallet.name} ·{" "}
                  {formatDate(transaction.transaction_date, locale)}
                </p>
              </div>

              <p
                className={cn(
                  "text-sm font-semibold",
                  isIncome ? "text-chart-2" : "text-destructive"
                )}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount, currency)}
              </p>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
