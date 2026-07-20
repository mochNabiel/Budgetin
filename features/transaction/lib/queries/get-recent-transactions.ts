import { cache } from "react"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"

const LIMIT = 10

export interface IRecentTransaction {
  id: string
  notes: string | null
  type: "income" | "expense"
  amount: number
  transaction_date: string
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

export const getRecentTransactions = cache(
  async (limit = LIMIT): Promise<IRecentTransaction[]> => {
    const supabase = await createClient()
    const user = await getUserData()

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id,
        notes,
        type,
        amount,
        transaction_date,
        category:categories (
          id,
          name,
          icon,
          color
        )
      `
      )
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return (data as unknown as IRecentTransaction[]) ?? []
  }
)
