"use server"

import { redirect } from "@/i18n/navigation"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { initialWalletSchema } from "@/shared/schemas/wallet.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function saveWallet(formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const locale = await getLocaleFromRequest()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: "You must be signed in" }
  }

  const parsed = initialWalletSchema.safeParse({
    name: formData.get("name")?.toString().trim(),
    balance: formData.get("balance"),
    currency: formData.get("currency")?.toString(),
    icon: formData.get("icon")?.toString(),
    color: formData.get("color")?.toString(),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const { name, balance, currency, icon, color } = parsed.data

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ currency, onboarding_completed: true })
    .eq("id", user.id)

  if (profileError) {
    return { success: false, message: "Failed to update profile" }
  }

  const { error: walletError } = await supabase.from("wallets").insert({
    user_id: user.id,
    name,
    icon,
    color,
    balance,
  })

  if (walletError) {
    return { success: false, message: "Failed to create wallet" }
  }

  redirect({ href: "/home", locale })

  return { success: true, message: "Onboarding complete" }
}
