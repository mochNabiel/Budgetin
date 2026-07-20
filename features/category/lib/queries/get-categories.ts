import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { cache } from "react"

export interface ICategory {
  id: string
  user_id: string
  type: string
  name: string
  icon: string
  color: string
}

export const getCategories = cache(async (): Promise<ICategory[]> => {
  const supabase = await createClient()
  const user = await getUserData()

  const { data, error } = await supabase
    .from("categories")
    .select(`id, user_id, type, name, icon, color`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as ICategory[]
})
