"use server"

import { getUserData } from "@/features/auth/lib/queries"
import { transactionSchema } from "@/shared/schemas/transaction.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function updateTransaction(
  id: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  // Validasi data baru
  const parsed = transactionSchema.safeParse({
    wallet_id: formData.get("wallet_id"),
    category_id: formData.get("category_id"),
    amount: formData.get("amount"),
    notes: formData.get("notes"),
    transaction_date: formData.get("transaction_date"),
    type: formData.get("type"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const data = parsed.data

  // Ambil transaksi lama (untuk tahu efek lama yang perlu di-rollback)
  const { data: oldTransaction, error: fetchError } = await supabase
    .from("transactions")
    .select("wallet_id, amount, type")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !oldTransaction) {
    return { success: false, message: "Transaction not found" }
  }

  const sameWallet = oldTransaction.wallet_id === data.wallet_id

  if (sameWallet) {
    // Rollback efek lama, lalu apply efek baru, dalam satu wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance")
      .eq("id", data.wallet_id)
      .single()

    if (!wallet) {
      return { success: false, message: "Wallet not found" }
    }

    const rolledBackBalance =
      oldTransaction.type === "income"
        ? wallet.balance - oldTransaction.amount
        : wallet.balance + oldTransaction.amount

    const nextBalance =
      data.type === "income"
        ? rolledBackBalance + data.amount
        : rolledBackBalance - data.amount

    if (data.type === "expense" && data.amount > rolledBackBalance) {
      return { success: false, message: "You don't have enough balance" }
    }

    await supabase
      .from("wallets")
      .update({ balance: nextBalance })
      .eq("id", data.wallet_id)
  } else {
    // Wallet berubah: rollback di wallet lama, apply di wallet baru
    const [{ data: oldWallet }, { data: newWallet }] = await Promise.all([
      supabase
        .from("wallets")
        .select("balance")
        .eq("id", oldTransaction.wallet_id)
        .single(),
      supabase
        .from("wallets")
        .select("balance")
        .eq("id", data.wallet_id)
        .single(),
    ])

    if (!oldWallet || !newWallet) {
      return { success: false, message: "Wallet not found" }
    }

    const rolledBackOldBalance =
      oldTransaction.type === "income"
        ? oldWallet.balance - oldTransaction.amount
        : oldWallet.balance + oldTransaction.amount

    const nextNewBalance =
      data.type === "income"
        ? newWallet.balance + data.amount
        : newWallet.balance - data.amount

    if (data.type === "expense" && data.amount > newWallet.balance) {
      return { success: false, message: "You don't have enough balance" }
    }

    await Promise.all([
      supabase
        .from("wallets")
        .update({ balance: rolledBackOldBalance })
        .eq("id", oldTransaction.wallet_id),
      supabase
        .from("wallets")
        .update({ balance: nextNewBalance })
        .eq("id", data.wallet_id),
    ])
  }

  // Update transaksi
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      wallet_id: data.wallet_id,
      category_id: data.category_id,
      amount: data.amount,
      notes: data.notes,
      transaction_date: data.transaction_date,
      type: data.type,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  revalidatePath("/transaction")
  revalidatePath(`/transaction/${id}`)
  revalidatePath("/home")

  return { success: true, message: "Transaction updated" }
}
