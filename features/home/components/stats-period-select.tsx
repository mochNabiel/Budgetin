"use client"

import { createContext, useContext, useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { formatMonthYear } from "@/shared/helper/date"
import { CardContent, CardDescription } from "@/components/ui/card"
import { ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBalanceSummaryForPeriod } from "../lib/actions/get-balance-summary"
import type { IBalanceSummary } from "@/types/balance-summary"
import BalanceText from "./balance-text"

const StatsContext = createContext<IBalanceSummary | null>(null)
const CurrencyContext = createContext<string>("IDR")

interface StatsPeriodSelectProps {
  currency: string
  initialSummary: IBalanceSummary
  labels: { income: string; expense: string }
}

export default function StatsPeriodSelect({
  currency,
  initialSummary,
  labels,
}: StatsPeriodSelectProps) {
  const t = useTranslations("home.stats")
  const locale = useLocale()
  const [period, setPeriod] = useState<"month" | "all">("month")
  const [summary, setSummary] = useState(initialSummary)
  const [isPending, startTransition] = useTransition()

  function handlePeriodChange(value: string) {
    if (value !== "month" && value !== "all") return
    setPeriod(value)
    startTransition(async () => {
      const nextSummary = await getBalanceSummaryForPeriod(value)
      setSummary(nextSummary)
    })
  }

  return (
    <CurrencyContext.Provider value={currency}>
      <StatsContext.Provider value={summary}>
        <CardDescription className="flex flex-col gap-1 text-3xl font-bold text-primary-foreground">
          <BalanceText amount={summary.totalBalance} currency={currency} />
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger
              aria-label={t("period_label")}
              className="h-auto w-fit max-w-full border-0 bg-transparent p-0 text-sm font-normal text-primary-foreground/80 shadow-none hover:bg-transparent focus-visible:ring-0 dark:hover:bg-transparent"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">
                {t("wallet_period", {
                  period: formatMonthYear(new Date(), locale),
                })}
              </SelectItem>
              <SelectItem value="all">{t("all_time")}</SelectItem>
            </SelectContent>
          </Select>
          <span className="sr-only" aria-live="polite">
            {isPending ? t("loading") : ""}
          </span>
        </CardDescription>
        <CardContent className="flex gap-4">
          <ItemContent>
            <ItemTitle className="gap-1 font-normal text-primary-foreground">
              <ArrowDownLeft className="size-4" />
              <span>{labels.income}</span>
            </ItemTitle>
            <ItemDescription className="ml-1 text-lg font-semibold text-primary-foreground">
              <StatsValue type="income" />
            </ItemDescription>
          </ItemContent>
          <ItemContent>
            <ItemTitle className="gap-1 font-normal text-primary-foreground">
              <ArrowUpRight className="size-4" />
              <span>{labels.expense}</span>
            </ItemTitle>
            <ItemDescription className="ml-1 text-lg font-semibold text-primary-foreground">
              <StatsValue type="expense" />
            </ItemDescription>
          </ItemContent>
        </CardContent>
      </StatsContext.Provider>
    </CurrencyContext.Provider>
  )
}

export function StatsValue({ type }: { type: "income" | "expense" }) {
  const summary = useContext(StatsContext)
  const currency = useContext(CurrencyContext)
  if (!summary) return null
  return (
    <BalanceText
      amount={type === "income" ? summary.totalIncome : summary.totalExpense}
      currency={currency}
    />
  )
}
