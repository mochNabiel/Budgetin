import { addMonths, differenceInCalendarMonths, format, startOfMonth, subMonths } from "date-fns"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"
import { getWallets } from "@/features/wallet/lib/queries"

export type Range = "1m" | "6m" | "12m" | "all"
type WalletOption = { id: string; name: string; icon: string }
type Bucket = { month: string; income: number; expense: number; netCashFlow: number }
export type StatisticsData = {
  range: Range
  walletId: string
  wallets: WalletOption[]
  currency: string
  months: Bucket[]
  totals: { income: number; expense: number }
  categories: Record<"income" | "expense", { id: number; name: string; icon: string | null; amount: number; percentage: number }[]>
  hasTransactions: boolean
}

export async function getStatistics(range: Range, requestedWalletId: string, uncategorizedLabel: string): Promise<StatisticsData> {
  const [supabase, user, wallets] = await Promise.all([createClient(), getUserData(), getWallets()])
  const walletId = requestedWalletId === "all" || wallets.some((wallet) => wallet.id === requestedWalletId) ? requestedWalletId : "all"
  const now = new Date()
  const currentMonth = startOfMonth(now)
  let from: Date | null = null
  if (range === "1m") from = subMonths(now, 1)
  if (range === "6m") from = startOfMonth(subMonths(now, 5))
  if (range === "12m") from = startOfMonth(subMonths(now, 11))

  const baseQuery = () => {
    let query = supabase.from("transactions").select("amount,type,transaction_date,category_id,category:categories(id,name,icon)").eq("user_id", user.id).in("type", ["income", "expense"]).order("transaction_date").order("id")
    // transaction_date is a date column; include today by using tomorrow as the exclusive upper bound.
    query = query.lt("transaction_date", format(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), "yyyy-MM-dd"))
    if (from) query = query.gte("transaction_date", format(from, "yyyy-MM-dd"))
    if (walletId !== "all") query = query.eq("wallet_id", walletId)
    return query
  }

  type Row = { amount: number; type: "income" | "expense"; transaction_date: string; category_id: number; category: { id: number; name: string; icon: string | null } | null }
  const rows: Row[] = []
  const pageSize = 1000
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await baseQuery().range(offset, offset + pageSize - 1)
    if (error) throw new Error("Unable to load statistics")
    const page = (data ?? []) as unknown as Row[]
    rows.push(...page)
    if (page.length < pageSize) break
  }

  const firstDate = rows.length ? new Date(`${rows[0].transaction_date}T00:00:00`) : currentMonth
  const monthCount = range === "all" ? Math.max(1, differenceInCalendarMonths(currentMonth, startOfMonth(firstDate)) + 1) : from ? differenceInCalendarMonths(currentMonth, startOfMonth(from)) + 1 : 6
  const yearly = range === "all" && monthCount > 120
  const periodCount = yearly ? Math.ceil(monthCount / 12) : monthCount
  const firstBucket = yearly ? startOfMonth(subMonths(currentMonth, monthCount - 1)) : startOfMonth(subMonths(currentMonth, periodCount - 1))
  const buckets = new Map<string, Bucket>()
  for (let index = 0; index < periodCount; index++) {
    const date = addMonths(firstBucket, yearly ? index * 12 : index)
    const key = format(date, yearly ? "yyyy" : "yyyy-MM")
    buckets.set(key, { month: key, income: 0, expense: 0, netCashFlow: 0 })
  }
  const totals = { income: 0, expense: 0 }
  const categoryMaps: Record<"income" | "expense", Map<number, { name: string; icon: string | null; amount: number }>> = { income: new Map(), expense: new Map() }
  for (const row of rows) {
    const amount = Number(row.amount)
    totals[row.type] += amount
    const transactionMonth = new Date(`${row.transaction_date}T00:00:00`)
    const key = format(transactionMonth, yearly ? "yyyy" : "yyyy-MM")
    const bucket = buckets.get(key)
    if (bucket) {
      bucket[row.type] += amount
      bucket.netCashFlow = bucket.income - bucket.expense
    }
    const categoryMap = categoryMaps[row.type]
    const category = categoryMap.get(row.category_id) ?? { name: row.category?.name ?? uncategorizedLabel, icon: row.category?.icon ?? null, amount: 0 }
    category.amount += amount
    categoryMap.set(row.category_id, category)
  }
  const categories = Object.fromEntries((Object.keys(categoryMaps) as (keyof typeof categoryMaps)[]).map((type) => [type, [...categoryMaps[type]].map(([id, item]) => ({ id, ...item, percentage: totals[type] ? item.amount / totals[type] * 100 : 0 })).sort((left, right) => right.amount - left.amount)])) as StatisticsData["categories"]
  return { range, walletId, wallets: wallets.map(({ id, name, icon }) => ({ id, name, icon })), currency: user.currency, months: [...buckets.values()], totals, categories, hasTransactions: rows.length > 0 }
}
