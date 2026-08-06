import { Pencil } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import formatCurrency from "@/shared/helper/format-currency"
import formatDate from "@/shared/helper/format-date"
import { cn } from "@/shared/utils"
import type { IWalletDetail } from "../../lib/queries/get-wallet-detail"
import type { WalletActivityItem } from "../../lib/queries/get-wallet-activity"
import WalletActivityTabs from "./wallet-activity-tabs"
import DetailRow from "./detail-row"

interface Props {
  wallet: IWalletDetail
  activity: WalletActivityItem[]
  currency: string
  locale: string
}

export default async function WalletDetail({
  wallet,
  activity,
  currency,
  locale,
}: Props) {
  const t = await getTranslations("wallet.detail")

  return (
    <main className="flex flex-col gap-4 p-2">
      <section
        className="flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 py-8"
        style={{ backgroundColor: `${wallet.color}30`, borderColor: wallet.color }}
      >
        <span
          className="flex size-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: wallet.color }}
        >
          {wallet.icon}
        </span>

        <p className={cn("text-3xl font-bold")}>
          {formatCurrency(wallet.balance, currency)}
        </p>

        <p className="text-sm text-muted-foreground">{wallet.name}</p>
      </section>

      <section className="flex flex-col divide-y divide-border rounded-2xl border">
        <DetailRow label={t("initial_balance")}>
          <span className="text-sm font-medium">
            {formatCurrency(wallet.initial_balance, currency)}
          </span>
        </DetailRow>

        <DetailRow label={t("created")}>
          <span className="text-sm font-medium">
            {formatDate(wallet.created_at, locale)}
          </span>
        </DetailRow>

        <DetailRow label={t("updated")}>
          <span className="text-sm font-medium">
            {formatDate(wallet.updated_at, locale)}
          </span>
        </DetailRow>
      </section>

      <section className="flex gap-2">
        <Button
          asChild
          className="h-12 flex-1"
        >
          <Link href={`/wallet/${wallet.id}/edit`}>
            <Pencil className="size-4" />
            {t("edit")}
          </Link>
        </Button>
      </section>

      <WalletActivityTabs
        activity={activity}
        currency={currency}
        locale={locale}
      />
    </main>
  )
}
