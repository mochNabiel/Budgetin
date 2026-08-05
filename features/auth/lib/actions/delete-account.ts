"use server"

import { revalidatePath } from "next/cache"

import { redirect } from "@/i18n/navigation"
import { createAdminClient } from "@/shared/supabase/admin"
import { createClient } from "@/shared/supabase/server"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { ActionState } from "@/types"

export async function deleteAccount(): Promise<ActionState> {
  const supabase = await createClient()
  const locale = await getLocaleFromRequest()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: "You must be signed in" }
  }

  const { error: signOutError } = await supabase.auth.signOut({
    scope: "local",
  })

  if (signOutError) {
    return { success: false, message: signOutError.message }
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/settings")
  redirect({
    href: "/auth/login",
    locale,
  })

  return { success: true, message: "Account deleted" }
}
