import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { routing } from "@/i18n/routing"

const PUBLIC_ROUTES = ["/"]
const AUTH_PREFIX = "/auth"
const LOGIN_PATH = "/auth/login"
const HOME_PATH = "/home"
const ONBOARDING_PATH = "/auth/onboarding"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  const locale =
    routing.locales.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    ) ?? routing.defaultLocale

  const route =
    pathname.replace(
      new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`),
      ""
    ) || "/"

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${path}`
    return NextResponse.redirect(url)
  }

  // OAuth code exchange — kirim ke dedicated route handler
  if (route === "/" && request.nextUrl.searchParams.has("code")) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/oauth`
    return NextResponse.redirect(url)
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(route)
  const isAuthRoute = route.startsWith(AUTH_PREFIX)
  const isOnboardingRoute = route === ONBOARDING_PATH

  // Decode JWT lokal — tidak ada network call
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  // Guest: block semua protected routes
  if (!user && !isPublicRoute && !isAuthRoute) {
    return redirectTo(LOGIN_PATH)
  }

  // Untuk user yang sudah login, cek onboarding status dari DB
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.sub)
      .single()

    const needsOnboarding = profile?.onboarding_completed === false

    // Belum onboarding — paksa ke onboarding
    if (needsOnboarding && !isOnboardingRoute) {
      return redirectTo(ONBOARDING_PATH)
    }

    // Sudah onboarding — block akses ke /auth/onboarding
    if (!needsOnboarding && isOnboardingRoute) {
      return redirectTo(HOME_PATH)
    }

    // Sudah login — block semua auth pages (login, verify-otp, dll)
    // kecuali onboarding yang sudah dihandle di atas
    if (isAuthRoute && !isOnboardingRoute) {
      return redirectTo(HOME_PATH)
    }
  }

  return supabaseResponse
}
