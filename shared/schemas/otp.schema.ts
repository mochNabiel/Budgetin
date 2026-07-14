import { z } from "zod"
import type { useTranslations } from "next-intl"

type T = ReturnType<typeof useTranslations>

export const otpSchema = (t: T) =>
  z.object({
    otp: z
      .string()
      .length(6, t("validation.otp_length"))
      .regex(/^\d+$/, t("validation.otp_numeric")),
  })

export type OtpFormValues = z.infer<ReturnType<typeof otpSchema>>
