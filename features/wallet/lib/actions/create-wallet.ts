"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "@/i18n/navigation"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { walletSchema } from "@/shared/schemas/wallet.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function createWallet(formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: "You must be signed in" }
  }

  const parsed = walletSchema.safeParse({
    name: formData.get("name")?.toString().trim(),
    balance: Number(formData.get("balance")),
    icon: formData.get("icon")?.toString(),
    color: formData.get("color")?.toString(),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const isOnboarding = formData.get("context") === "onboarding"

  const { error: walletError } = await supabase.from("wallets").insert({
    user_id: user.id,
    name: parsed.data.name,
    icon: parsed.data.icon,
    color: parsed.data.color,
    initial_balance: parsed.data.balance,
    balance: parsed.data.balance,
  })

  if (walletError) {
    return { success: false, message: "Failed to create wallet" }
  }

  if (isOnboarding) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id)

    if (profileError) {
      return { success: false, message: "Failed to complete onboarding" }
    }

    const locale = await getLocaleFromRequest()
    redirect({ href: "/home", locale })
  }

  revalidatePath("/wallet")
  revalidatePath("/home")
  revalidatePath("/transaction/new")

  return { success: true, message: "Wallet created" }
}
