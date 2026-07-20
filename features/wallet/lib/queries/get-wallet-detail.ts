import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"

export interface IWalletDetail {
  id: string
  name: string
  icon: string
  color: string
  balance: number
  created_at: string
  updated_at: string
}

export const getWalletDetail = cache(
  async (id: string): Promise<IWalletDetail> => {
    const supabase = await createClient()
    const user = await getUserData()

    const { data, error } = await supabase
      .from("wallets")
      .select("id, name, icon, color, balance, created_at, updated_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw new Error(error.message)

    return data
  }
)
