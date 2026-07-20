import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { IWallet } from "@/types/wallet"
import { cache } from "react"

export const getWallets = cache(async (): Promise<IWallet[]> => {
  const supabase = await createClient()
  const user = await getUserData()

  const { data, error } = await supabase
    .from("wallets")
    .select(`id, user_id, name, balance, icon, color`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
})
