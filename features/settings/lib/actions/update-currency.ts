"use server"

import { revalidatePath } from "next/cache"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function updateCurrency(currency: string): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  const { error } = await supabase
    .from("profiles")
    .update({ currency })
    .eq("id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/home")
  revalidatePath("/wallet")
  revalidatePath("/transaction")
  revalidatePath("/transfer")
  revalidatePath("/settings")

  return { success: true, message: "Currency updated" }
}
