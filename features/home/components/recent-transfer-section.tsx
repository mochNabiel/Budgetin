import { SectionHeader } from "@/components/global/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserData } from "@/features/auth/lib/queries"
import { getRecentTransfers } from "@/features/transfer/lib/queries/get-recent-transfers"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { ArrowRight, ChevronRight, Repeat } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

export default async function RecentTransfersSection() {
  const [t, locale, { currency }, recentTransfers] = await Promise.all([
    getTranslations("home"),
    getLocale(),
    getUserData(),
    getRecentTransfers(),
  ])

  return (
    <section>
      <SectionHeader
        title={t("recent_transfers.title")}
        action={
          <Button variant="link" className="h-fit" asChild>
            <Link href="/transfer">{t("view_all")}</Link>
          </Button>
        }
      />

      {recentTransfers.length === 0 ? (
        <Card size="sm">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Repeat className="size-5 text-muted-foreground" />
            </span>

            <p className="text-sm font-medium">
              {t("recent_transfers.empty_title")}
            </p>

            <p className="text-xs text-muted-foreground">
              {t("recent_transfers.empty_description")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card size="sm" className="data-[size=sm]:py-0">
          <CardContent className="divide-y divide-border/60">
            {recentTransfers.map((transfer) => (
              <Link
                key={transfer.id}
                href={`/transfer/${transfer.id}`}
                className="flex w-full items-center gap-3 py-3"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="flex items-center gap-1 truncate text-sm font-medium">
                    <span
                      className="flex size-4 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: transfer.from_wallet.color }}
                    >
                      {transfer.from_wallet.icon}
                    </span>

                    <span className="truncate">
                      {transfer.from_wallet.name}
                    </span>

                    <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                    <span
                      className="flex size-4 shrink-0 items-center justify-center rounded-full"
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
      )}
    </section>
  )
}
