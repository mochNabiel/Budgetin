import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { ICategory } from "@/types/category"
import { cache } from "react"

export type { ICategory } from "@/types/category"

type CategoryFilter = "all" | "income" | "expense"

export const getCategories = cache(
  async (filter: CategoryFilter = "all"): Promise<ICategory[]> => {
    const supabase = await createClient()
    const user = await getUserData()

    let query = supabase
      .from("categories")
      .select("id, user_id, type, name, icon, color")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (filter !== "all") {
      query = query.eq("type", filter)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data as ICategory[]
  }
)
