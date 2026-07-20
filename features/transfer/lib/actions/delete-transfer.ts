"use server"

import { revalidatePath } from "next/cache"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function deleteTransfer(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  const { data: transfer, error: fetchError } = await supabase
    .from("transfers")
    .select("from_wallet_id, to_wallet_id, amount")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !transfer) {
    return { success: false, message: "Transfer not found" }
  }

  const { error: deleteError } = await supabase
    .from("transfers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (deleteError) {
    return { success: false, message: deleteError.message }
  }

  const [{ data: fromWallet }, { data: toWallet }] = await Promise.all([
    supabase
      .from("wallets")
      .select("balance")
      .eq("id", transfer.from_wallet_id)
      .single(),
    supabase
      .from("wallets")
      .select("balance")
      .eq("id", transfer.to_wallet_id)
      .single(),
  ])

  if (fromWallet) {
    await supabase
      .from("wallets")
      .update({ balance: fromWallet.balance + transfer.amount })
      .eq("id", transfer.from_wallet_id)
  }

  if (toWallet) {
    await supabase
      .from("wallets")
      .update({ balance: toWallet.balance - transfer.amount })
      .eq("id", transfer.to_wallet_id)
  }

  revalidatePath("/home")
  revalidatePath("/transfer")

  return { success: true, message: "Transfer deleted" }
}
