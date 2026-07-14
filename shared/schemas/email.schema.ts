import { z } from "zod"
import type { useTranslations } from "next-intl"

type T = ReturnType<typeof useTranslations>

export const emailSchema = (t: T) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.email_required"))
      .email(t("validation.email_invalid")),
  })

export type EmailFormValues = z.infer<ReturnType<typeof emailSchema>>
