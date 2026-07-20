"use server"

import { getUserData } from "@/features/auth/lib/queries"
import { walletSchema } from "@/shared/schemas/wallet.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function updateWallet(
  id: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  const parsed = walletSchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    balance: formData.get("balance"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const { error } = await supabase
    .from("wallets")
    .update({
      name: parsed.data.name,
      icon: parsed.data.icon,
      color: parsed.data.color,
      balance: parsed.data.balance,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/wallet")
  revalidatePath("/home")
  revalidatePath("/transaction/new")

  return { success: true, message: "Wallet updated" }
}
