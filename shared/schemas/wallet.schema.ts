import { z } from "zod"
import { currencyCodes } from "@/constants/currencies"

export const walletSchema = z.object({
  name: z
    .string()
    .min(1, "Wallet name is required")
    .max(30, "Wallet name must be at most 30 characters"),
  balance: z.coerce.number().min(0, "Balance must be at least 0"),
  icon: z.string().min(1, "Pick an icon"),
  color: z.string().min(1, "Pick a color"),
})

export const initialWalletSchema = walletSchema.extend({
  currency: z.enum(currencyCodes, {
    errorMap: () => ({ message: "Select a currency" }),
  }),
})

export type WalletFormValues = z.infer<typeof walletSchema>
export type InitialWalletFormValues = z.infer<typeof initialWalletSchema>
