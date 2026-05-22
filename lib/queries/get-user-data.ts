import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const getAuth = cache(async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
})

export const getUserData = cache(async () => {
  const supabase = await createClient()

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", (await getAuth()).id)
    .single()

  return userData
})

