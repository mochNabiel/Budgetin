import { createClient } from "@/shared/supabase/server"
import { cache } from "react"
import { getAuth } from "./get-auth"

export interface IUser {
  id: string
  email: string
  full_name: string
  avatar_url: string
  plan: string
  onboarding_completed: boolean
  currency: string
}

export const getUserData = cache(async () => {
  const supabase = await createClient()

  const auth = await getAuth()

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      full_name,
      avatar_url,
      plan,
      onboarding_completed,
      currency
      `
    )
    .eq("id", auth?.sub)
    .single()

  if (error) throw error

  return data as IUser
})
