"use server"

import { revalidatePath } from "next/cache"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function deleteCategory(id: number): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  const { data: category, error: fetchError } = await supabase
    .from("categories")
    .select("id, is_default")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !category) {
    return { success: false, message: "Category not found" }
  }

  if (category.is_default) {
    return { success: false, message: "Default category cannot be deleted" }
  }

  const { count } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
    .eq("user_id", user.id)

  if ((count ?? 0) > 0) {
    return {
      success: false,
      message: "Category is used by transactions and cannot be deleted",
    }
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/category")
  revalidatePath("/transaction/new")
  revalidatePath("/home")

  return { success: true, message: "Category deleted" }
}
