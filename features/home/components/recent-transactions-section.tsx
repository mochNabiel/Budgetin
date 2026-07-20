import { SectionHeader } from "@/components/global/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserData } from "@/features/auth/lib/queries"
import { getRecentTransactions } from "@/features/transaction/lib/queries/get-recent-transactions"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { cn } from "@/shared/utils"
import { ChevronRight, Receipt } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

export default async function RecentTransactionsSection() {
  const t = await getTranslations("home")
  const locale = await getLocale()
  const { currency } = await getUserData()
  const recentTransactions = await getRecentTransactions()

  return (
    <section>
      <SectionHeader
        title={t("recent_transactions.title")}
        action={
          <Button variant="link" className="h-fit" asChild>
            <Link href="/transaction">{t("view_all")}</Link>
          </Button>
        }
      />

      {recentTransactions.length === 0 ? (
        <Card size="sm">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Receipt className="size-5 text-muted-foreground" />
            </span>
            <p className="text-sm font-medium">{t("recent_transactions.empty_title")}</p>
            <p className="text-xs text-muted-foreground">
              {t("recent_transactions.empty_description")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card size="sm" className="data-[size=sm]:py-0">
          <CardContent className="divide-y divide-border/60">
            {recentTransactions.map((transaction) => {
              const isIncome = transaction.type === "income"

              return (
                <Link
                  key={transaction.id}
                  href={`/transaction/${transaction.id}`}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
                    style={{
                      backgroundColor: `${transaction.category.color}`,
                    }}
                  >
                    {transaction.category.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {transaction.notes}
                    </p>

                    <p className="text-xs text-muted-foreground">
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

                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              )
            })}
          </CardContent>
        </Card>
      )}
    </section>
  )
}
