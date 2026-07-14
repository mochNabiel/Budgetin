"use server"

import { redirect } from "@/i18n/navigation"
import { getLocaleFromRequest } from "@/shared/get-locale-from-request"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"
import { cookies } from "next/headers"

export const verifyOtp = async (
  _: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = await getLocaleFromRequest()

  const email = cookieStore.get("pending_email")?.value
  const otp = formData.get("otp") as string

  if (!email) {
    return {
      success: false,
      message: "Email tidak ditemukan. Silakan login kembali.",
    }
  }

  if (!otp) {
    return {
      success: false,
      message: "Kode OTP wajib diisi",
    }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  const user = data.user

  if (!user) {
    return {
      success: false,
      message: "User tidak ditemukan",
    }
  }

  cookieStore.delete("pending_email")

  redirect({
    href: "/home",
    locale,
  })

  return {
    success: true,
    message: "Login berhasil",
  }
}
