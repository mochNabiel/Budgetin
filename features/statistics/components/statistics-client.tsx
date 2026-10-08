"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"
import { CalendarDays, ChartNoAxesCombined } from "lucide-react"
import { format, parseISO } from "date-fns"
import { enUS, id } from "date-fns/locale"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import formatCurrency from "@/shared/helper/format-currency"
import type { StatisticsData } from "../lib/statistics"

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function StatisticsLoading() {
  return <div className="mx-auto max-w-md space-y-5 p-4"><Skeleton className="h-14 w-full rounded-2xl"/><Skeleton className="h-64 rounded-3xl"/><Skeleton className="h-72 rounded-3xl"/><Skeleton className="h-44 rounded-3xl"/></div>
}

export default function StatisticsClient({ data, locale }: { data: StatisticsData; locale: string }) {
  const t = useTranslations("statistics")
  const router = useRouter()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()
  const start = parseISO(data.period.from)
  const end = parseISO(data.period.to)
  const dateLocale = locale === "id" ? id : enUS
  const money = (amount: number) => formatCurrency(amount, data.currency)
  const periodLabel = t(`period.${data.period.preset === "last-3-months" ? "last3Months" : data.period.preset === "this-month" ? "thisMonth" : data.period.preset === "last-month" ? "lastMonth" : "custom"}`)
  const chartConfig = { income: { label: t("overview.income"), color: "var(--chart-1)" }, expense: { label: t("overview.expense"), color: "var(--chart-2)" } }
  const chartCategories = data.categories.slice(0, 5).map((item, index) => ({ ...item, fill: COLORS[index] })).concat(data.categories.length > 5 ? [{ id: -1, name: t("spendingByCategory.others"), icon: null, amount: data.categories.slice(5).reduce((sum, item) => sum + item.amount, 0), percentage: data.categories.slice(5).reduce((sum, item) => sum + item.percentage, 0), fill: COLORS[4] }] : [])

  function changePeriod(preset: string) {
    const next = new URLSearchParams(params.toString())
    next.set("period", preset)
    if (preset !== "custom") { next.delete("from"); next.delete("to") }
    startTransition(() => router.push(`?${next.toString()}`))
  }
  function changeDate(which: "from" | "to", date?: Date) {
    if (!date) return
    const next = new URLSearchParams(params.toString())
    next.set("period", "custom")
    next.set(which, format(date, "yyyy-MM-dd"))
    startTransition(() => router.push(`?${next.toString()}`))
  }

  return <main className="mx-auto mb-24 w-full max-w-md space-y-5 px-4 pt-4">
    <header className="space-y-4">
      <div><h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1><p className="mt-1 text-sm text-muted-foreground">{format(start, "PP", { locale: dateLocale })} – {format(end, "PP", { locale: dateLocale })}</p></div>
      <div className="flex gap-2">
        <Select value={data.period.preset} onValueChange={changePeriod}><SelectTrigger aria-label={t("period.label")} className="h-11 flex-1 rounded-2xl bg-background"><SelectValue placeholder={periodLabel}/></SelectTrigger><SelectContent><SelectItem value="this-month">{t("period.thisMonth")}</SelectItem><SelectItem value="last-month">{t("period.lastMonth")}</SelectItem><SelectItem value="last-3-months">{t("period.last3Months")}</SelectItem><SelectItem value="custom">{t("period.custom")}</SelectItem></SelectContent></Select>
        {data.period.preset === "custom" && <><DatePicker label={t("period.startDate")} date={start} locale={dateLocale} onChange={date => changeDate("from", date)}/><DatePicker label={t("period.endDate")} date={end} locale={dateLocale} onChange={date => changeDate("to", date)}/></>}
      </div>
    </header>
    {pending && <span className="sr-only" role="status">{t("loading")}</span>}
    {!data.hasTransactions ? <Card className="rounded-3xl shadow-sm"><CardContent className="flex flex-col items-center gap-2 px-5 py-12 text-center"><span className="flex size-12 items-center justify-center rounded-full bg-muted"><ChartNoAxesCombined className="size-5 text-muted-foreground"/></span><p className="text-sm text-muted-foreground">{t("empty.noTransactions")}</p></CardContent></Card> : <>
      <section aria-labelledby="trend-title" className="space-y-3">
        <div><h2 id="trend-title" className="text-base font-semibold">{t("incomeVsExpense.title")}</h2><p className="text-xs text-muted-foreground">{t("incomeVsExpense.description")}</p></div>
        <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="px-3 pt-4 pb-3">
          <ChartContainer config={chartConfig} className="h-56 w-full aspect-auto" aria-label={t("incomeVsExpense.description")}><BarChart accessibilityLayer data={data.trend} margin={{ left: 2, right: 8, top: 8 }} barGap={4}><CartesianGrid vertical={false}/><XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={22} tickFormatter={value => format(parseISO(value.length === 7 ? `${value}-01` : value), value.length === 7 ? "MMM yy" : "d MMM", { locale: dateLocale })}/><YAxis hide/><ChartTooltip content={<ChartTooltipContent formatter={value => money(Number(value))}/>} /><Bar dataKey="income" fill="var(--color-income)" radius={[4,4,0,0]} maxBarSize={22}/><Bar dataKey="expense" fill="var(--color-expense)" radius={[4,4,0,0]} maxBarSize={22}/></BarChart></ChartContainer>
          <div className="flex justify-center gap-5 pt-2 text-xs"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-chart-1"/>{t("overview.income")}</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-chart-2"/>{t("overview.expense")}</span></div>
        </CardContent></Card>
      </section>
      <section aria-labelledby="category-title" className="space-y-3">
        <div><h2 id="category-title" className="text-base font-semibold">{t("spendingByCategory.title")}</h2><p className="text-xs text-muted-foreground">{t("spendingByCategory.description")}</p></div>
        <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-4">
          {data.overview.expense === 0 ? <Empty text={t("empty.noExpenses")}/> : <><div className="relative mx-auto mb-3 h-48 w-full max-w-56"><ChartContainer config={chartConfig} className="h-full w-full aspect-square" aria-label={t("spendingByCategory.description")}><PieChart accessibilityLayer><Pie data={chartCategories} dataKey="amount" nameKey="name" innerRadius={55} outerRadius={82} strokeWidth={3}/><ChartTooltip content={<ChartTooltipContent formatter={(value, name) => <span>{String(name)} · {money(Number(value))}</span>}/>} /></PieChart></ChartContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-xs text-muted-foreground">{t("spendingByCategory.total")}</span><span className="max-w-32 truncate text-sm font-semibold tabular-nums">{money(data.overview.expense)}</span></div></div><ul className="divide-y">{data.categories.slice(0, 6).map((category, index) => <li key={category.id} className="flex items-center gap-3 py-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}>{category.icon ?? <span className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}/>}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{category.name}</span><span className="text-xs text-muted-foreground">{category.percentage.toLocaleString(locale, { maximumFractionDigits: 1 })}%</span></span><span className="text-right text-sm font-semibold tabular-nums">{money(category.amount)}</span></li>)}</ul></>}
        </CardContent></Card>
      </section>
    </>}
  </main>
}

function Empty({ text }: { text: string }) { return <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"><ChartNoAxesCombined className="size-5" aria-hidden="true"/>{text}</div> }
function DatePicker({ label, date, locale, onChange }: { label: string; date: Date; locale: typeof enUS | typeof id; onChange: (date?: Date) => void }) { return <Popover><PopoverTrigger asChild><Button variant="outline" size="icon" className="size-11 shrink-0 rounded-2xl" aria-label={`${label}: ${format(date, "PP", { locale })}`}><CalendarDays className="size-4"/></Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={onChange} locale={locale}/></PopoverContent></Popover> }
