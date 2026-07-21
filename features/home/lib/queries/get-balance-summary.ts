import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"

export interface IBalanceSummary {
  totalBalance: number
  totalIncome: number
  totalExpense: number
}

interface GetBalanceSummaryParams {
  from?: string // ISO date, default awal bulan ini
  to?: string // ISO date, default hari ini
  walletBalance?: number // reuse dari getWallets() kalau sudah ada
}

export const getBalanceSummary = cache(
  async (params?: GetBalanceSummaryParams): Promise<IBalanceSummary> => {
    const supabase = await createClient()
    const user = await getUserData()

    const now = new Date()
    const from =
      params?.from ??
      new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
    const to = params?.to ?? now.toISOString().split("T")[0]

    // Parallel: total saldo wallet + semua transaksi bulan ini
    const [walletsResult, transactionsResult] = await Promise.all([
      // 1. Total saldo semua wallet (skip kalau sudah di-pass dari luar)
      params?.walletBalance !== undefined
        ? { data: null, error: null }
        : supabase
            .from("wallets")
            .select("balance")
            .eq("user_id", user.id),
      // 2. Semua transaksi bulan ini (1 query, filter income/expense di JS)
      supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id)
        .gte("transaction_date", from)
        .lte("transaction_date", to),
    ])

    if (walletsResult.error) throw new Error(walletsResult.error.message)
    if (transactionsResult.error) throw new Error(transactionsResult.error.message)

    const totalBalance =
      params?.walletBalance ??
      (walletsResult.data ?? []).reduce(
        (sum, wallet) => sum + wallet.balance,
        0
      )

    const transactions = transactionsResult.data ?? []
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    return { totalBalance, totalIncome, totalExpense }
  }
)
