"use server"

import { getUserData } from "@/features/auth/lib/queries"
import { transferSchema } from "@/shared/schemas/transfer.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createTransfer(formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  const parsed = transferSchema.safeParse({
    from_wallet_id: formData.get("from_wallet_id"),
    to_wallet_id: formData.get("to_wallet_id"),
    amount: formData.get("amount"),
    notes: formData.get("notes"),
    transfer_date: formData.get("transfer_date"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const data = parsed.data

  const [{ data: fromWallet }, { data: toWallet }] = await Promise.all([
    supabase
      .from("wallets")
      .select("balance")
      .eq("id", data.from_wallet_id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("wallets")
      .select("balance")
      .eq("id", data.to_wallet_id)
      .eq("user_id", user.id)
      .single(),
  ])

  if (!fromWallet || !toWallet) {
    return { success: false, message: "Wallet not found" }
  }

  if (data.amount > fromWallet.balance) {
    return { success: false, message: "Insufficient balance in source wallet" }
  }

  const { error: insertError } = await supabase.from("transfers").insert({
    user_id: user.id,
    from_wallet_id: data.from_wallet_id,
    to_wallet_id: data.to_wallet_id,
    amount: data.amount,
    notes: data.notes,
    transfer_date: data.transfer_date,
  })

  if (insertError) {
    return { success: false, message: insertError.message }
  }

  await Promise.all([
    supabase
      .from("wallets")
      .update({ balance: fromWallet.balance - data.amount })
      .eq("id", data.from_wallet_id),
    supabase
      .from("wallets")
      .update({ balance: toWallet.balance + data.amount })
      .eq("id", data.to_wallet_id),
  ])

  revalidatePath("/home")
  revalidatePath("/transaction")

  return { success: true, message: "Transfer successful" }
}
