import { z } from "zod"

export const categorySchema = z.object({
  type: z.enum(["income", "expense"]),
  name: z.string().trim().min(1).max(50),
  icon: z.string().trim().min(1).max(8),
  color: z.string().trim().min(1),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
