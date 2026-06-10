"use server"

import { cookies } from "next/headers"
import { redirect } from "@/i18n/navigation"
import { getLocale } from "next-intl/server"

import { createClient } from "@/lib/supabase/server"
import { ActionState } from "@/types"

const signInWithGoogle = async () => {
  const supabase = await createClient()
  const locale = await getLocale()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/oauth?next=/home`,
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
    message: "Silakan login menggunakan akun Google Anda.",
  }
}

const signInWithOtp = async (
  _: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = await getLocale()

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

  cookieStore.set("pending_email", email, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 10,
    path: "/",
  })

  redirect({
    href: "/auth/verify-otp",
    locale,
  })

  return {
    success: true,
    message: "Kode OTP telah dikirim ke email Anda.",
  }
}

const verifyOtp = async (
  _: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = await getLocale()

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

  // ambil onboarding status
  const { data: profile } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()

  cookieStore.delete("pending_email")

  // user belum onboarding
  if (!profile?.onboarding_completed) {
    cookieStore.set("needs_onboarding", "true", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 10,
    })

    redirect({
      href: "/auth/onboarding",
      locale,
    })

    return {
      success: true,
      message: "Login berhasil",
    }
  }

  redirect({
    href: "/home",
    locale,
  })

  return {
    success: true,
    message: "Login berhasil",
  }
}

const completeOnboarding = async (
  _: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = await getLocale()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      message: "Unauthorized",
    }
  }

  const fullName = formData.get("full_name")?.toString().trim()
  const avatar = formData.get("avatar") as File | null

  if (!fullName) {
    return {
      success: false,
      message: "Nama wajib diisi",
    }
  }

  let avatarUrl: string | null = user.user_metadata?.avatar_url ?? null

  /**
   * Upload avatar baru jika user pilih file
   */
  if (avatar && avatar.size > 0) {
    const fileExt = avatar.name.split(".").pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar, {
        upsert: true,
      })

    if (uploadError) {
      return {
        success: false,
        message: uploadError.message,
      }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    avatarUrl = publicUrl
  }

  /**
   * Update auth metadata
   */
  const { error: updateAuthError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      avatar_url: avatarUrl,
    },
  })

  if (updateAuthError) {
    return {
      success: false,
      message: updateAuthError.message,
    }
  }

  /**
   * Update users table
   */
  const { error: dbError } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
      onboarding_completed: true,
    })
    .eq("id", user.id)

  if (dbError) {
    return {
      success: false,
      message: dbError.message,
    }
  }

  /**
   * onboarding selesai
   */
  cookieStore.delete("needs_onboarding")

  redirect({
    href: "/home",
    locale,
  })

  return {
    success: true,
    message: "Onboarding selesai",
  }
}

const logout = async () => {
  const supabase = await createClient()
  const locale = await getLocale()

  await supabase.auth.signOut()

  redirect({
    href: "/auth/login",
    locale,
  })
}

export {
  signInWithGoogle,
  signInWithOtp,
  verifyOtp,
  completeOnboarding,
  logout,
}
