"use server"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function deleteTransaction(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  // Ambil transaksi dulu untuk tahu wallet_id, amount, type —
  // supaya balance wallet bisa di-rollback saat transaksi dihapus
  const { data: transaction, error: fetchError } = await supabase
    .from("transactions")
    .select("wallet_id, amount, type")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !transaction) {
    return { success: false, message: "Transaction not found" }
  }

  const { error: deleteError } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (deleteError) {
    return { success: false, message: deleteError.message }
  }

  // Rollback balance wallet — kebalikan dari efek transaksi saat dibuat
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("id", transaction.wallet_id)
    .single()

  if (wallet) {
    const rolledBackBalance =
      transaction.type === "income"
        ? wallet.balance - transaction.amount
        : wallet.balance + transaction.amount

    await supabase
      .from("wallets")
      .update({ balance: rolledBackBalance })
      .eq("id", transaction.wallet_id)
  }

  revalidatePath("/transaction")
  revalidatePath("/home")

  return { success: true, message: "Transaction deleted" }
}
