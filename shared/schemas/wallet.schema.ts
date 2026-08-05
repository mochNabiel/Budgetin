import { z } from "zod"

export const walletSchema = z.object({
  name: z.string().min(1, "Wallet name is required").max(50),
  balance: z.number().min(0, "Balance must be 0 or more"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
})

export type WalletFormValues = z.infer<typeof walletSchema>