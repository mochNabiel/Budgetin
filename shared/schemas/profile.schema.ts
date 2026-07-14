import { z } from "zod"

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  avatarFile: z.custom<FileList>().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
