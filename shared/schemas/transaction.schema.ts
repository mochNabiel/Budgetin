import { z } from "zod"

export const transactionSchema = z.object({
  wallet_id: z.string().uuid(),
  category_id: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
  notes: z.string().trim().max(500).optional(),
  transaction_date: z.coerce.date(),
  type: z.enum(["income", "expense"]),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
