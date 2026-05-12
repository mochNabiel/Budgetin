"use server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface FormState {
  success: boolean
  message: string
}

const signInWithGoogle = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/oauth?next=/home`,
      skipBrowserRedirect: true, // <-- server doesn't have window, so we return the URL instead
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

  redirect(`/auth/verify-otp?email=${email}`)
}

const verifyOtp = async (prev: FormState, formData: FormData) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email: formData.get("email") as string,
    token: formData.get("otp") as string,
    type: "email",
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  redirect("/home")
}

const logout = async () => {
  const supabase = await createClient()

  await supabase.auth.signOut()
}

export { signInWithGoogle, signInWithOtp, verifyOtp, logout }
