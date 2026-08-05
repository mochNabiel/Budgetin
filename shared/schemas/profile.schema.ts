import { z } from "zod"
import { currencyCodes } from "@/constants/currencies"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"]

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  avatar: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Image must be smaller than 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only PNG, JPG, or WEBP files are allowed"
    )
    .optional()
    .nullable(),
  currency: z.enum(currencyCodes, {
    errorMap: () => ({ message: "Select a currency" }),
  }),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
