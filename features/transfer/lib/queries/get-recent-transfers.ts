import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { getUserData } from "@/features/auth/lib/queries"

export interface IRecentTransfer {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
  from_wallet: { id: string; name: string; icon: string; color: string }
  to_wallet: { id: string; name: string; icon: string; color: string }
}

const LIMIT = 5

export const getRecentTransfers = cache(
  async (limit = LIMIT): Promise<IRecentTransfer[]> => {
    const supabase = await createClient()
    const user = await getUserData()

    const { data, error } = await supabase
      .from("transfers")
      .select(
        `
        id,
        amount,
        notes,
        transfer_date,
        from_wallet:wallets!transfers_from_wallet_id_fkey ( id, name, icon, color ),
        to_wallet:wallets!transfers_to_wallet_id_fkey ( id, name, icon, color )
      `
      )
      .eq("user_id", user.id)
      .order("transfer_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)

    return (data as unknown as IRecentTransfer[]) ?? []
  }
)
