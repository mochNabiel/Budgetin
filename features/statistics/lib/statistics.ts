import { addDays, differenceInCalendarDays, endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"

export type PeriodPreset = "this-month" | "last-month" | "last-3-months" | "custom"
export type StatisticsPeriod = { preset: PeriodPreset; from: string; to: string }
export type StatisticsData = {
  period: StatisticsPeriod
  currency: string
  overview: { income: number; expense: number; netCashFlow: number }
  trend: { date: string; income: number; expense: number }[]
  categories: { id: number; name: string; icon: string | null; amount: number; percentage: number }[]
  comparison: { income: number; expense: number; netCashFlow: number }
  hasTransactions: boolean
  hasPreviousTransactions: boolean
}

function dateString(date: Date) { return format(date, "yyyy-MM-dd") }
function parseDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return dateString(date) === value ? date : null
}

export function resolveStatisticsPeriod(preset: PeriodPreset, from?: string, to?: string, now = new Date()): StatisticsPeriod {
  let start: Date
  let end: Date
  if (preset === "custom") {
    start = parseDate(from) ?? startOfMonth(now)
    end = parseDate(to) ?? now
    if (start > end) [start, end] = [end, start]
  } else if (preset === "last-month") {
    start = startOfMonth(subMonths(now, 1)); end = endOfMonth(start)
  } else if (preset === "last-3-months") {
    start = startOfMonth(subMonths(now, 2)); end = now
  } else {
    start = startOfMonth(now); end = now
  }
  return { preset, from: dateString(start), to: dateString(end) }
}

function previousPeriod(period: StatisticsPeriod) {
  const start = parseDate(period.from)!
  const end = parseDate(period.to)!
  if (period.preset === "this-month" || period.preset === "last-month") {
    const previousStart = startOfMonth(subMonths(start, 1))
    return { from: dateString(previousStart), to: dateString(endOfMonth(previousStart)) }
  }
  const days = differenceInCalendarDays(end, start) + 1
  const previousEnd = addDays(start, -1)
  return { from: dateString(addDays(previousEnd, -days + 1)), to: dateString(previousEnd) }
}

export async function getStatistics(period: StatisticsPeriod): Promise<StatisticsData> {
  const [supabase, user] = await Promise.all([createClient(), getUserData()])
  const previous = previousPeriod(period)
  const select = "amount, type, transaction_date, category_id, category:categories(id, name, icon)"
  const [currentResult, previousResult] = await Promise.all([
    supabase.from("transactions").select(select).eq("user_id", user.id).gte("transaction_date", period.from).lte("transaction_date", period.to).in("type", ["income", "expense"]).order("transaction_date"),
    supabase.from("transactions").select("amount, type").eq("user_id", user.id).gte("transaction_date", previous.from).lte("transaction_date", previous.to).in("type", ["income", "expense"]),
  ])
  if (currentResult.error) throw new Error("Unable to load statistics")
  if (previousResult.error) throw new Error("Unable to load previous statistics")

  const rows = (currentResult.data ?? []) as unknown as { amount: number; type: "income" | "expense"; transaction_date: string; category_id: number; category: { id: number; name: string; icon: string | null } | null }[]
  const prevRows = previousResult.data ?? []
  const sum = (items: { amount: number; type: string }[], type: string) => items.reduce((total, item) => total + (item.type === type ? Number(item.amount) : 0), 0)
  const income = sum(rows, "income")
  const expense = sum(rows, "expense")
  const previousIncome = sum(prevRows, "income")
  const previousExpense = sum(prevRows, "expense")
  const categoryTotals = new Map<number, { name: string; icon: string | null; amount: number }>()
  const daily = new Map<string, { income: number; expense: number }>()
  for (const row of rows) {
    if (row.type === "expense") {
      const category = categoryTotals.get(row.category_id) ?? { name: row.category?.name ?? "Uncategorized", icon: row.category?.icon ?? null, amount: 0 }
      category.amount += Number(row.amount); categoryTotals.set(row.category_id, category)
    }
    const point = daily.get(row.transaction_date) ?? { income: 0, expense: 0 }
    point[row.type] += Number(row.amount); daily.set(row.transaction_date, point)
  }
  const rangeDays = differenceInCalendarDays(parseDate(period.to)!, parseDate(period.from)!) + 1
  const monthly = rangeDays > 100
  const trendMap = new Map<string, { income: number; expense: number }>()
  for (const [date, value] of daily) {
    const key = monthly ? date.slice(0, 7) : date
    const point = trendMap.get(key) ?? { income: 0, expense: 0 }
    point.income += value.income; point.expense += value.expense; trendMap.set(key, point)
  }
  const categories = [...categoryTotals.entries()].map(([id, value]) => ({ id, ...value, percentage: expense ? value.amount / expense * 100 : 0 })).sort((a, b) => b.amount - a.amount)
  return {
    period, currency: user.currency,
    overview: { income, expense, netCashFlow: income - expense },
    trend: [...trendMap].sort(([a], [b]) => a.localeCompare(b)).map(([date, values]) => ({ date, ...values })),
    categories, comparison: { income: previousIncome, expense: previousExpense, netCashFlow: previousIncome - previousExpense },
    hasTransactions: rows.length > 0, hasPreviousTransactions: prevRows.length > 0,
  }
}
