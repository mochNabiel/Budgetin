import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"

export interface ITransaction {
  id: string
  notes: string | null
  type: "income" | "expense"
  amount: number
  transaction_date: string
  wallet: {
    id: string
    name: string
    icon: string
    color: string
  }
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

interface GetTransactionsParams {
  from?: string
  to?: string
  type?: "income" | "expense"
  walletId?: string
  categoryId?: number
}

export const getTransactions = cache(
  async (params?: GetTransactionsParams): Promise<ITransaction[]> => {
    const supabase = await createClient()
    const user = await getUserData()

    let query = supabase
      .from("transactions")
      .select(
        `
        id,
        notes,
        type,
        amount,
        transaction_date,
        wallet:wallets ( id, name, icon, color ),
        category:categories ( id, name, icon, color )
      `
      )
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })

    if (params?.type) query = query.eq("type", params.type)
    if (params?.walletId) query = query.eq("wallet_id", params.walletId)
    if (params?.categoryId) query = query.eq("category_id", params.categoryId)
    if (params?.from) query = query.gte("transaction_date", params.from)
    if (params?.to) query = query.lte("transaction_date", params.to)

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return (data as unknown as ITransaction[]) ?? []
  }
)
