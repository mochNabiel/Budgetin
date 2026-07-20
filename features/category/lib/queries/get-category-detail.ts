import { cache } from "react"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"

export interface ICategoryDetail {
  id: number
  user_id: string | null
  type: "income" | "expense"
  name: string
  icon: string
  color: string
  created_at: string
}

export const getCategoryDetail = cache(
  async (id: number): Promise<ICategoryDetail> => {
    const supabase = await createClient()
    const user = await getUserData()

    const { data, error } = await supabase
      .from("categories")
      .select("id, user_id, type, name, icon, color, created_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw new Error(error.message)

    return data as ICategoryDetail
  }
)
