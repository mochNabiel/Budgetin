"use server"

import { revalidatePath } from "next/cache"

import { getUserData } from "@/features/auth/lib/queries"
import { categorySchema } from "@/shared/schemas/category.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function createCategory(formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const user = await getUserData()

  const parsed = categorySchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    type: parsed.data.type,
    name: parsed.data.name,
    icon: parsed.data.icon,
    color: parsed.data.color,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/category")
  revalidatePath("/transaction/new")
  revalidatePath("/home")
  revalidatePath("/wallet")

  return { success: true, message: "Category created" }
}
