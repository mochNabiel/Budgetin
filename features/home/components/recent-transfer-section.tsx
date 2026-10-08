import { SectionHeader } from "@/components/global/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserData } from "@/features/auth/lib/queries"
import { getRecentTransfers } from "@/features/transfer/lib/queries/get-recent-transfers"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { ChevronRight, Repeat } from "lucide-react"
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
        <Card size="sm" className="data-[size=sm]:py-0 ring-0 shadow-sm">
          <CardContent>
            {recentTransfers.map((transfer) => (
              <Link
                key={transfer.id}
                href={`/transfer/${transfer.id}`}
                className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex shrink-0 items-center">
                  <span
                    className="relative z-10 flex size-10 items-center justify-center rounded-full text-base ring-3 ring-card"
                    style={{ backgroundColor: transfer.from_wallet.color }}
                  >
                    {transfer.from_wallet.icon}
                  </span>
                  <span
                    className="relative -ml-4 flex size-10 items-center justify-center rounded-full text-base ring-3 ring-card"
                    style={{ backgroundColor: transfer.to_wallet.color }}
                  >
                    {transfer.to_wallet.icon}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium flex items-center gap-1 text-base">
                    {transfer.from_wallet.name}
                    <ChevronRight className="size-4 text-muted-foreground" />
                    {transfer.to_wallet.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatDate(transfer.transfer_date, locale)}
                  </p>
                </div>

                <p className="text-base font-semibold">
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
