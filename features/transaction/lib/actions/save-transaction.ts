"use server"

import { getUserData } from "@/features/auth/lib/queries"
import { getWallets } from "@/features/wallet/lib/queries"
import { transactionSchema } from "@/shared/schemas/transaction.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function saveTransaction(
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const user = await getUserData()

  // Cek wallet
  const wallets = await getWallets()
  const wallet = wallets.find((w) => w.id === formData.get("wallet_id"))

  if (!wallet) {
    return {
      success: false,
      message: "Wallet not found",
    }
  }

  // Validasi data
  const parsed = transactionSchema.safeParse({
    wallet_id: formData.get("wallet_id"),
    category_id: formData.get("category_id"),
    amount: formData.get("amount"),
    notes: formData.get("notes"),
    transaction_date: formData.get("transaction_date"),
    type: formData.get("type"),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    }
  }

  const data = parsed.data

  // Cek jika type expense dan jumlah lebih besar dari balance
  if (data.type === "expense" && data.amount > wallet.balance) {
    return {
      success: false,
      message: "You don't have enough balance",
    }
  }

  // Simpan transaksi
  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    wallet_id: data.wallet_id,
    category_id: data.category_id,
    amount: data.amount,
    notes: data.notes,
    transaction_date: data.transaction_date,
    type: data.type,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  // Update saldo wallet
  const nextBalance =
    data.type === "income"
      ? wallet.balance + data.amount
      : wallet.balance - data.amount

  await supabase
    .from("wallets")
    .update({
      balance: nextBalance,
    })
    .eq("id", wallet.id)

  return {
    success: true,
    message: "Transaction saved successfully",
  }
}
