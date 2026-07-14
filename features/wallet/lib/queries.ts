import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { cache } from "react"

export const getWallets = cache(async () => {
  const supabase = await createClient()

  const user = await getUserData()

  const { data, error } = await supabase
    .from("wallets")
    .select(`id, name, balance, currency, icon, color`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    data,
  }
})
