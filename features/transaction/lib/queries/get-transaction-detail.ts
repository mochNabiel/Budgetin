import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"

export interface ITransactionDetail {
  id: string
  type: "income" | "expense"
  amount: number
  notes: string | null
  attachment_url: string | null
  transaction_date: string
  created_at: string
  updated_at: string
  wallet: {
    id: string
    name: string
    icon: string
    color: string
    balance: number
  }
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

export const getTransactionDetail = cache(
  async (id: string): Promise<ITransactionDetail> => {
    const supabase = await createClient()
    const user = await getUserData()

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id,
        type,
        amount,
        notes,
        attachment_url,
        transaction_date,
        created_at,
        updated_at,
        wallet:wallets ( id, name, icon, color, balance ),
        category:categories ( id, name, icon, color )
      `
      )
      .eq("user_id", user.id)
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message)

    return data as unknown as ITransactionDetail
  }
)
