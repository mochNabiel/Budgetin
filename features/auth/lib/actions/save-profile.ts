"use server"

import { profileSchema } from "@/shared/schemas/profile.schema"
import { createClient } from "@/shared/supabase/server"
import { ActionState } from "@/types"

export async function saveProfile(formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: "You must be signed in" }
  }

  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name")?.toString().trim(),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    }
  }

  const { full_name } = parsed.data
  const avatar = formData.get("avatar") as File | null
  let avatarUrl = user.user_metadata?.avatar_url ?? null

  if (avatar && avatar.size > 0) {
    const fileExt = avatar.name.split(".").pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar, { upsert: true })

    if (uploadError) {
      return { success: false, message: "Failed to upload avatar" }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    avatarUrl = publicUrl
  }

  const { error: updateAuthError } = await supabase.auth.updateUser({
    data: { full_name, avatar_url: avatarUrl },
  })

  if (updateAuthError) {
    return { success: false, message: "Failed to update profile" }
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ full_name, avatar_url: avatarUrl })
    .eq("id", user.id)

  if (dbError) {
    return { success: false, message: "Failed to save profile" }
  }

  return { success: true, message: "Profile saved" }
}
