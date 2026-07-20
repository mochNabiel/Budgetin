import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { routing } from "@/i18n/routing"
import { createClient } from "@/shared/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  const locale =
    routing.locales.find((l) => l === cookieLocale) ?? routing.defaultLocale

  if (!code) {
    return NextResponse.redirect(`${origin}/${locale}/auth/error`)
  }

  const supabase = await createClient()
  const { data: sessionData, error } =
    await supabase.auth.exchangeCodeForSession(code)

  if (error || !sessionData.user) {
    return NextResponse.redirect(`${origin}/${locale}/auth/error`)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", sessionData.user.id)
    .maybeSingle()

  const nextPath = profile?.onboarding_completed ? "/home" : "/auth/onboarding"

  return NextResponse.redirect(new URL(`${origin}/${locale}${nextPath}`))
}
