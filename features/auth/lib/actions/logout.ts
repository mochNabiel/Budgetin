"use server"

import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export const logout = async (): Promise<ActionState> => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Logged out" }
}
