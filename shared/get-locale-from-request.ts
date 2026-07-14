import "server-only"

import { cookies, headers } from "next/headers"
import { routing } from "@/i18n/routing"

/**
 * Baca locale dari cookie next-intl atau dari referer URL.
 * Fallback ke defaultLocale.
 *
 * Dipakai di server actions karena getLocale() tidak reliable
 * dalam konteks server action POST request.
 */
export async function getLocaleFromRequest(): Promise<string> {
  const cookieStore = await cookies()
  const headerStore = await headers()

  // Coba dari cookie NEXT_LOCALE (set by next-intl middleware)
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    return cookieLocale
  }

  // Fallback: parse dari Referer header
  const referer = headerStore.get("referer") ?? ""
  const url = new URL(referer || "http://localhost")
  const segments = url.pathname.split("/")
  const refererLocale = segments[1]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (refererLocale && routing.locales.includes(refererLocale as any)) {
    return refererLocale
  }

  // Ultimate fallback
  return routing.defaultLocale
}
