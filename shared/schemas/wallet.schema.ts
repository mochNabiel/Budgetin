import { z } from "zod"
import { currencyCodes } from "@/constants/currencies"

export const walletSchema = z.object({
  name: z
    .string()
    .min(1, "Wallet name is required")
    .max(30, "Wallet name must be at most 30 characters"),
  balance: z
    .string()
    .min(1, "Starting balance is required")
    .refine(
      (v) => !isNaN(Number(v.replace(/\./g, ""))),
      "Balance must be a valid number"
    ),
  currency: z.enum(currencyCodes, {
    errorMap: () => ({ message: "Select a currency" }),
  }),
  icon: z.string().min(1, "Pick an icon"),
  color: z.string().min(1, "Pick a color"),
})

export type WalletFormValues = z.infer<typeof walletSchema>
