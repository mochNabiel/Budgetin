import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"
import { ITransactionDetail } from "@/types/transaction-detail"

export type { ITransactionDetail } from "@/types/transaction-detail"

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
