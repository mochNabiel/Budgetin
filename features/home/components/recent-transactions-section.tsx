import { SectionHeader } from "@/components/global/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { transactionsItem } from "@/shared/data"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { cn } from "@/shared/utils"
import { ChevronRight } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

export default async function RecentTransactionsSection() {
  const t = await getTranslations("home.recent_transactions")
  const locale = await getLocale()
  return (
    <section>
      <SectionHeader
        title={t("title")}
        action={
          <Button variant="link" className="h-fit" asChild>
            <Link href="/transaction">{t("view_all")}</Link>
          </Button>
        }
      />

      <Card size="sm" className="data-[size=sm]:py-0">
        <CardContent className="divide-y divide-border/60">
          {transactionsItem.map((transaction) => {
            const isIncome = transaction.category.type === "income"

            return (
              <Link
                key={transaction.id}
                href={`/transaction/${transaction.id}`}
                type="button"
                className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
                  style={{
                    backgroundColor: `${transaction.category.color}40`,
                  }}
                >
                  {transaction.category.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {transaction.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date, locale)}
                  </p>
                </div>

                <p
                  className={cn(
                    "text-sm font-semibold",
                    isIncome ? "text-chart-2" : "text-destructive"
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>

                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}
