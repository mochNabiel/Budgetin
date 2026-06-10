import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { routing } from "@/i18n/routing"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  /**
   * Detect locale
   */
  const locale =
    routing.locales.find(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    ) ?? null

  /**
   * Redirect:
   * / -> /en
   * /home -> /en/home
   * /auth/login -> /en/auth/login
   */
  if (!locale) {
    const url = request.nextUrl.clone()

    url.pathname =
      pathname === "/"
        ? `/${routing.defaultLocale}`
        : `/${routing.defaultLocale}${pathname}`

    return NextResponse.redirect(url)
  }

  /**
   * Remove locale prefix
   *
   * /en/home -> /home
   * /id/auth/login -> /auth/login
   */
  const route =
    pathname.replace(
      new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`),
      ""
    ) || "/"

  const PUBLIC_ROUTES = ["/"]

  const AUTH_PREFIX = "/auth"

  const DEFAULT_LOGIN_PATH = "/auth/login"
  const DEFAULT_HOME_PATH = "/home"
  const ONBOARDING_PATH = "/auth/onboarding"

  const isPublicRoute = PUBLIC_ROUTES.includes(route)

  const isAuthRoute = route.startsWith(AUTH_PREFIX)

  const isOnboardingRoute = route === ONBOARDING_PATH

  const needsOnboarding =
    request.cookies.get("needs_onboarding")?.value === "true"

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()

    url.pathname = `/${locale}${path}`

    return NextResponse.redirect(url)
  }

  /**
   * IMPORTANT:
   * Keep immediately after createServerClient
   */
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  /**
   * Guest cannot access protected routes
   */
  if (!user && !isPublicRoute && !isAuthRoute) {
    return redirectTo(DEFAULT_LOGIN_PATH)
  }

  /**
   * User must finish onboarding
   */
  if (user && needsOnboarding) {
    if (!isOnboardingRoute) {
      return redirectTo(ONBOARDING_PATH)
    }

    return supabaseResponse
  }

  /**
   * Logged-in user should not access auth pages
   */
  if (user && isAuthRoute) {
    return redirectTo(DEFAULT_HOME_PATH)
  }

  return supabaseResponse
}
