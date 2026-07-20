import { cache } from "react"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"

export interface ITransfer {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
  from_wallet: {
    id: string
    name: string
    icon: string
    color: string
  }
  to_wallet: {
    id: string
    name: string
    icon: string
    color: string
  }
}

export interface ITransferDetail {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
  created_at: string
  updated_at: string
  from_wallet: {
    id: string
    name: string
    icon: string
    color: string
    balance: number
  }
  to_wallet: {
    id: string
    name: string
    icon: string
    color: string
    balance: number
  }
}

interface GetTransfersParams {
  from?: string
  to?: string
}

export const getTransfers = cache(
  async (params?: GetTransfersParams): Promise<ITransfer[]> => {
    const supabase = await createClient()
    const user = await getUserData()

    let query = supabase
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

    if (params?.from) query = query.gte("transfer_date", params.from)
    if (params?.to) query = query.lte("transfer_date", params.to)

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return (data as unknown as ITransfer[]) ?? []
  }
)

export const getTransferDetail = cache(
  async (id: string): Promise<ITransferDetail> => {
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
        created_at,
        updated_at,
        from_wallet:wallets!transfers_from_wallet_id_fkey ( id, name, icon, color, balance ),
        to_wallet:wallets!transfers_to_wallet_id_fkey ( id, name, icon, color, balance )
      `
      )
      .eq("user_id", user.id)
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message)

    return data as unknown as ITransferDetail
  }
)
