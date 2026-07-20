import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { getUserData } from "@/features/auth/lib/queries"
import { formatMonthYear } from "@/shared/helper/date"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { getBalanceSummary } from "../lib/queries/get-balance-summary"
import BalanceVisibilityButton from "./balance-visibility-button"
import BalanceText from "./balance-text"

export default async function StatsSection() {
  const t = await getTranslations("home.stats")
  const locale = await getLocale()
  const { currency } = await getUserData()
  const { totalBalance, totalIncome, totalExpense } = await getBalanceSummary()

  return (
    <Card
      size="sm"
      className="relative overflow-hidden border-0 bg-primary ring-0"
    >
      {/* blurred light glow, top right */}
      <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/25 blur-3xl" />

      {/* secondary soft glow, bottom left, subtler */}
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-white/10 blur-3xl" />

      {/* glossy diagonal sheen */}
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
        <CardDescription className="flex flex-col gap-1 text-3xl font-bold text-primary-foreground">
          <BalanceText amount={totalBalance} currency={currency} />
          <span className="text-sm font-normal text-primary-foreground/80">
            {t("wallet_period", {
              period: formatMonthYear(new Date(), locale),
            })}
          </span>
        </CardDescription>
        <CardAction>
          <BalanceVisibilityButton />
        </CardAction>
      </CardHeader>

      <div className="relative z-10 px-4">
        <Separator className="bg-primary-foreground/30" />
      </div>

      <CardContent className="relative z-10 flex gap-4">
        <ItemContent>
          <ItemTitle className="gap-1 font-normal text-primary-foreground">
            <ArrowDownLeft className="size-4" />
            <span>{t("income")}</span>
          </ItemTitle>
          <ItemDescription className="ml-1 text-lg font-semibold text-primary-foreground">
            <BalanceText amount={totalIncome} currency={currency} />
          </ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle className="gap-1 font-normal text-primary-foreground">
            <ArrowUpRight className="size-4" />
            <span>{t("expense")}</span>
          </ItemTitle>
          <ItemDescription className="ml-1 text-lg font-semibold text-primary-foreground">
            <BalanceText amount={totalExpense} currency={currency} />{" "}
          </ItemDescription>
        </ItemContent>
      </CardContent>
    </Card>
  )
}
