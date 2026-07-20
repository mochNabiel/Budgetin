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

    // 1. Total saldo semua wallet
    const { data: wallets, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)

    if (walletError) throw new Error(walletError.message)

    const totalBalance = (wallets ?? []).reduce(
      (sum, wallet) => sum + wallet.balance,
      0
    )

    // 2. Semua transaksi dalam rentang tanggal (income + expense sekaligus,
    //    supaya cukup 1 query, lalu dipisah manual di JS)
    const { data: transactions, error: transactionError } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", user.id)
      .gte("transaction_date", from)
      .lte("transaction_date", to)

    if (transactionError) throw new Error(transactionError.message)

    const totalIncome = (transactions ?? [])
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = (transactions ?? [])
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    return { totalBalance, totalIncome, totalExpense }
  }
)
