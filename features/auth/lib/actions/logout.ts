"use server"

import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { createClient } from "@/shared/supabase/server"
import { redirect } from "@/i18n/navigation"

export const logout = async () => {
  const supabase = await createClient()
  const locale = await getLocaleFromRequest()

  await supabase.auth.signOut()

  redirect({
    href: "/auth/login",
    locale,
  })
}
