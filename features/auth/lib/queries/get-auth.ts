import { cache } from "react"
import { createClient } from "@/shared/supabase/server"
import { redirect } from "@/i18n/navigation"
import { getLocale } from "next-intl/server"

export const getAuth = cache(async () => {
  const supabase = await createClient()
  const locale = await getLocale()

  const { data } = await supabase.auth.getClaims()

  const claims = data?.claims

  if (!claims) {
    redirect({ href: "/auth/login", locale })
  }

  return claims
})