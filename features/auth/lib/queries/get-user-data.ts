import { createClient } from "@/shared/supabase/server"
import { cache } from "react"
import { getAuth } from "./get-auth"

export const getUserData = cache(async () => {
  const supabase = await createClient()

  const auth = await getAuth()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth?.sub)
    .single()

  if (error) throw error

  return data
})