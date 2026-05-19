"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface FormState {
  success: boolean
  message?: string
}

const signInWithGoogle = async () => {
  const supabase = await createClient()

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

  redirect(data.url)
}

const signInWithOtp = async (prev: FormState, formData: FormData) => {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const email = formData.get("email") as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  // Nyimpen email di cookie biar ga terekspos di url & hrs dilempar via input hidden
  cookieStore.set("pending_email", email, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 10,
    path: "/",
  })

  redirect(`/auth/verify-otp?email=${email}`)
}

const verifyOtp = async (prev: FormState, formData: FormData) => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const email = cookieStore.get("pending_email")?.value

  if (!email) {
    return {
      success: false,
      message: "Email tidak ditemukan. Silahkan login kembali.",
    }
  }

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: formData.get("otp") as string,
    type: "email",
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  cookieStore.delete("pending_email")

  redirect("/home")
}

const logout = async () => {
  const supabase = await createClient()

  await supabase.auth.signOut()
}

const deleteAccount = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      message: "Pengguna tidak ditemukan.",
    }
  }

  // Delete user data from your tables first (if any)
  // Example: await supabase.from("profiles").delete().eq("id", user.id)

  // Delete the auth user via admin client or RPC
  // If you have a Supabase Edge Function or RPC for this:
  const { error } = await supabase.rpc("delete_user")

  if (error) {
    // Fallback: sign out and let admin handle cleanup
    // In production, call a server-side admin endpoint instead
    return {
      success: false,
      message: "Gagal menghapus akun. Hubungi support jika masalah berlanjut.",
    }
  }

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export { signInWithGoogle, signInWithOtp, verifyOtp, logout, deleteAccount }
