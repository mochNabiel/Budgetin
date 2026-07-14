"use server"

import { redirect } from "@/i18n/navigation"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { createClient } from "@/shared/supabase/server"
import { headers } from "next/headers"

export const signInWithGoogle = async () => {
  const supabase = await createClient()
  const locale = await getLocaleFromRequest()
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/oauth?next=/home`,
      skipBrowserRedirect: true,
    },
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  redirect({
    href: data.url,
    locale,
  })

  return {
    success: true,
    message: "Sign in with Google successfully",
  }
}
