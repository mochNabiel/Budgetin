"use server"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function deleteWallet(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  // Pastikan user masih punya wallet lain setelah ini dihapus —
  // aplikasi ini mengasumsikan user selalu punya minimal 1 wallet
  // (misal untuk default value form transaksi)
  const { count } = await supabase
    .from("wallets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  if ((count ?? 0) <= 1) {
    return {
      success: false,
      message: "You must have at least one wallet",
    }
  }

  // PENTING: wallets punya `on delete cascade` ke transactions —
  // menghapus wallet akan ikut menghapus SEMUA transaksi terkait secara permanen
  const { error } = await supabase
    .from("wallets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/wallet")
  revalidatePath("/home")
  revalidatePath("/transaction")
  revalidatePath("/transaction/new")

  return { success: true, message: "Wallet deleted" }
}
