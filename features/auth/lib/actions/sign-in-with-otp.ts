"use server"

import { redirect } from "@/i18n/navigation"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { cookies } from "next/headers"

export const signInWithOtp = async (
  _: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = await getLocaleFromRequest()

  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      message: "Email wajib diisi",
    }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  cookieStore.set("pending_email", email)

  redirect({
    href: "/auth/verify-otp",
    locale,
  })

  return {
    success: true,
    message: "Kode OTP telah dikirim ke email Anda.",
  }
}
