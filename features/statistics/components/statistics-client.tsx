"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import { ChartNoAxesCombined, WalletCards } from "lucide-react"
import { format, parseISO } from "date-fns"
import { enUS, id } from "date-fns/locale"
import { useLocale, useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import formatCurrency from "@/shared/helper/format-currency"
import type { StatisticsData } from "../lib/statistics"

const categoryTokenNames = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "primary",
] as const
const categoryTokenValues = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
] as const

export function StatisticsLoading() {
  return (
    <main className="w-full space-y-5 p-2">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </main>
  )
}

export default function StatisticsClient({ data }: { data: StatisticsData }) {
  const t = useTranslations("statistics")
  const locale = useLocale()
  const dateLocale = locale === "id" ? id : enUS
  const router = useRouter()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [categoryType, setCategoryType] = useState<"expense" | "income">("expense")
  const money = (value: number) => formatCurrency(value, data.currency)
  const incomeExpenseConfig = {
    income: { label: t("series.income"), color: "var(--chart-2)" },
    expense: { label: t("series.expense"), color: "var(--primary)" },
  }
  const cashFlowConfig = {
    netCashFlow: { label: t("series.netCashFlow"), color: "var(--primary)" },
  }
  const categoryConfig = Object.fromEntries(
    categoryTokenNames.map((token, index) => [
      token,
      { label: token, color: categoryTokenValues[index] },
    ])
  )
  const selectedCategories = data.categories[categoryType]
  const selectedCategoryTotal = data.totals[categoryType]
  const categoryData = selectedCategories
    .slice(0, 5)
    .map((category, index) => ({
      ...category,
      fill: categoryTokenValues[index],
    }))
  if (selectedCategories.length > 5)
    categoryData.push({
      id: -1,
      name: t("category.others"),
      icon: null,
      amount: selectedCategories
        .slice(5)
        .reduce((sum, item) => sum + item.amount, 0),
      percentage: selectedCategories
        .slice(5)
        .reduce((sum, item) => sum + item.percentage, 0),
      fill: "var(--chart-5)",
    })

  function updateFilter(key: "range" | "wallet", value: string) {
    if (params.get(key) === value) return
    const next = new URLSearchParams(params.toString())
    next.set(key, value)
    startTransition(() => router.push(`?${next.toString()}`, { scroll: false }))
  }
  function monthLabel(value: string) {
    if (/^\d{4}$/.test(value)) return value
    return format(parseISO(`${value}-01`), "MMM yyyy", { locale: dateLocale })
  }
  function axisMoney(value: number) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: data.currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  return (
    <main className="mb-20 w-full space-y-5 p-2">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </header>
      <section
        aria-label={t("filters.label")}
        className="space-y-3 rounded-2xl bg-muted/40 p-3"
      >
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            {t("filters.period")}
          </p>
          <ToggleGroup
            type="single"
            value={data.range}
            onValueChange={(value) => value && updateFilter("range", value)}
            variant="outline"
            spacing={0}
            className="grid h-10 w-full grid-cols-4 overflow-hidden rounded-full border bg-background"
          >
            <ToggleGroupItem
              value="1m"
              className="h-full min-w-0 rounded-none px-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {t("filters.oneMonth")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="6m"
              className="h-full min-w-0 rounded-none px-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {t("filters.sixMonths")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="12m"
              className="h-full min-w-0 rounded-none px-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {t("filters.twelveMonths")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="all"
              className="h-full min-w-0 rounded-none px-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {t("filters.allTime")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <WalletCards className="size-3.5" />
            {t("filters.wallet")}
          </p>
          <Select
            value={data.walletId}
            onValueChange={(value) => updateFilter("wallet", value)}
          >
            <SelectTrigger
              className="h-10 w-full rounded-full bg-background"
              aria-label={t("filters.wallet")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allWallets")}</SelectItem>
              {data.wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.icon} {wallet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
      <span className="sr-only" role="status">
        {pending ? t("loading") : ""}
      </span>
      {!data.hasTransactions ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <ChartNoAxesCombined className="size-5 text-muted-foreground" />
            </span>
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="text-xs text-muted-foreground">
              {t("empty.description")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <ChartSection
            title={t("incomeExpense.title")}
            description={t("incomeExpense.description")}
          >
            <ChartContainer
              config={incomeExpenseConfig}
              className="aspect-auto h-64 w-full"
              aria-label={t("incomeExpense.description")}
            >
              <BarChart
                accessibilityLayer
                data={data.months}
                margin={{ left: 2, right: 4, top: 6 }}
                barGap={4}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={20}
                  tickFormatter={monthLabel}
                />
                <YAxis
                  width={66}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={axisMoney}
                  tick={{ fontSize: 10 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => monthLabel(String(label))}
                      formatter={(value) => money(Number(value))}
                    />
                  }
                />
                <Bar
                  dataKey="income"
                  fill="var(--color-income)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="expense"
                  fill="var(--color-expense)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ChartContainer>
            <Legend
              items={[
                [t("series.income"), "var(--chart-2)"],
                [t("series.expense"), "var(--primary)"],
              ]}
            />
          </ChartSection>
          <ChartSection
            title={t(categoryType === "expense" ? "category.titleExpense" : "category.titleIncome")}
            description={t(categoryType === "expense" ? "category.descriptionExpense" : "category.descriptionIncome")}
          >
            <ToggleGroup
              type="single"
              value={categoryType}
              onValueChange={(value) => value && setCategoryType(value as "income" | "expense")}
              variant="outline"
              spacing={0}
              aria-label={t("category.filterLabel")}
              className="mb-3 grid h-9 w-full grid-cols-2 overflow-hidden rounded-full border bg-background"
            >
              <ToggleGroupItem value="expense" className="h-full rounded-none text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t("series.expense")}</ToggleGroupItem>
              <ToggleGroupItem value="income" className="h-full rounded-none text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t("series.income")}</ToggleGroupItem>
            </ToggleGroup>
            {selectedCategoryTotal === 0 ? (
              <Empty text={t(categoryType === "expense" ? "category.emptyExpense" : "category.emptyIncome")} />
            ) : (
              <div className="grid items-center gap-3 sm:grid-cols-[minmax(150px,0.9fr)_1.1fr]">
                <div className="relative mx-auto h-48 w-full max-w-56">
                  <ChartContainer
                    config={categoryConfig}
                    className="aspect-square h-full w-full"
                    aria-label={t(categoryType === "expense" ? "category.descriptionExpense" : "category.descriptionIncome")}
                  >
                    <PieChart accessibilityLayer>
                      <Pie
                        data={categoryData}
                        dataKey="amount"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={82}
                        strokeWidth={3}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => (
                              <span>
                                {String(name)} · {money(Number(value))}
                              </span>
                            )}
                          />
                        }
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {t(categoryType === "expense" ? "category.totalExpense" : "category.totalIncome")}
                    </span>
                    <span className="max-w-36 truncate text-sm font-semibold tabular-nums">
                        {money(selectedCategoryTotal)}
                    </span>
                  </div>
                </div>
                <ul className="divide-y">
                  {categoryData.map((category) => (
                    <li
                      key={category.id}
                      className="flex items-center gap-2 py-2.5"
                    >
                      <i
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: category.fill }}
                      />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">
                        {category.icon && (
                          <span className="mr-1">{category.icon}</span>
                        )}
                        {category.name}
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-xs font-medium tabular-nums">
                          {money(category.amount)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {category.percentage.toLocaleString(locale, {
                            maximumFractionDigits: 1,
                          })}
                          %
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ChartSection>
          <ChartSection
            title={t("cashFlow.title")}
            description={t("cashFlow.description")}
          >
            <ChartContainer
              config={cashFlowConfig}
              className="aspect-auto h-64 w-full"
              aria-label={t("cashFlow.description")}
            >
              <LineChart
                accessibilityLayer
                data={data.months}
                margin={{ left: 2, right: 8, top: 8 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={20}
                  tickFormatter={monthLabel}
                />
                <YAxis
                  width={66}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={axisMoney}
                  tick={{ fontSize: 10 }}
                  domain={[
                    (dataMin) => Math.min(0, Number(dataMin)),
                    (dataMax) => Math.max(0, Number(dataMax)),
                  ]}
                />
                <ReferenceLine y={0} stroke="var(--border)" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => monthLabel(String(label))}
                      formatter={(_value, _name, item) => (
                        <span>
                          {t("cashFlow.tooltip", {
                            income: money(Number(item.payload.income)),
                            expense: money(Number(item.payload.expense)),
                            net: money(Number(item.payload.netCashFlow)),
                          })}
                        </span>
                      )}
                    />
                  }
                />
                <Line
                  dataKey="netCashFlow"
                  type="monotone"
                  stroke="var(--color-netCashFlow)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-netCashFlow)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
            <Legend items={[[t("series.netCashFlow"), "var(--primary)"]]} />
          </ChartSection>
        </>
      )}
    </main>
  )
}

function ChartSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="w-full">
      <Card size="sm" className="w-full gap-3 rounded-2xl py-4 shadow-sm ring-0">
        <CardContent>
          <div className="mb-3">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </CardContent>
      </Card>
    </section>
  )
}
function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex justify-center gap-5 pt-2">
      {items.map(([label, color]) => (
        <span
          key={label}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <i
            className="size-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}
function Empty({ text }: { text: string }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
      <ChartNoAxesCombined className="size-5" aria-hidden="true" />
      {text}
    </div>
  )
}
