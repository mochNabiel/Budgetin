import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getUserData } from "@/features/auth/lib/queries"
import { getTranslations } from "next-intl/server"
import { getBalanceSummary } from "../lib/queries/get-balance-summary"
import { getWallets } from "@/features/wallet/lib/queries"
import BalanceVisibilityButton from "./balance-visibility-button"
import StatsPeriodSelect from "./stats-period-select"

export default async function StatsSection() {
  const [t, { currency }, wallets] = await Promise.all([
    getTranslations("home.stats"),
    getUserData(),
    getWallets(),
  ])

  const walletBalance = wallets.reduce((sum, w) => sum + w.balance, 0)
  const initialSummary = await getBalanceSummary({ walletBalance })

  return (
    <Card
      size="sm"
      className="relative overflow-hidden border-0 bg-primary shadow-sm ring-0"
    >
      <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-white/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.05) 52%, transparent 65%)",
        }}
      />

      <CardHeader className="relative z-10">
        <CardTitle className="text-xs tracking-wide text-primary-foreground uppercase">
          {t("total_balance")}
        </CardTitle>
        <StatsPeriodSelect
          currency={currency}
          initialSummary={initialSummary}
          labels={{ income: t("income"), expense: t("expense") }}
        />
        <CardAction>
          <BalanceVisibilityButton />
        </CardAction>
      </CardHeader>
    </Card>
  )
}
