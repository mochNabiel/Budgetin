import { type NextRequest } from "next/server"
import { updateSession } from "@/shared/supabase/proxy"
import { handleI18nRouting } from "@/i18n/proxy"

export async function proxy(request: NextRequest) {
  // 1. next-intl handle locale detection & routing dulu
  const intlResponse = handleI18nRouting(request)

  // 2. lanjut ke Supabase session/auth logic,
  //    dengan response dari next-intl sebagai base (bukan bikin baru)
  return await updateSession(request, intlResponse)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
