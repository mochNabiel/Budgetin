"use server"

import { revalidatePath } from "next/cache"

import { createAdminClient } from "@/shared/supabase/admin"
import { createClient } from "@/shared/supabase/server"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { redirect } from "@/i18n/navigation"

export async function deleteAccount() {
  const supabase = await createClient()
  const locale = await getLocaleFromRequest()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: "You must be signed in" }
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  await supabase.auth.signOut()

  revalidatePath("/settings")

  redirect({
    href: "/auth/login",
    locale,
  })
}
