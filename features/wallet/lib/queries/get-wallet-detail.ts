import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"
import { IWalletDetail } from "@/types/wallet-detail"

export type { IWalletDetail } from "@/types/wallet-detail"

export const getWalletDetail = cache(
  async (id: string): Promise<IWalletDetail> => {
    const supabase = await createClient()
    const user = await getUserData()

    const { data, error } = await supabase
      .from("wallets")
      .select(
        "id, name, icon, color, initial_balance, balance, created_at, updated_at"
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw new Error(error.message)

    return data
  }
)
