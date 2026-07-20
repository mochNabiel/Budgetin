import { z } from "zod"

export const transferSchema = z
  .object({
    from_wallet_id: z.string().uuid(),
    to_wallet_id: z.string().uuid(),
    amount: z.coerce.number().positive(),
    notes: z.string().trim().max(500).optional(),
    transfer_date: z.coerce.date(),
  })
  .refine((data) => data.from_wallet_id !== data.to_wallet_id, {
    message: "Source and destination wallet must be different",
    path: ["to_wallet_id"],
  })

export type TransferFormValues = z.infer<typeof transferSchema>
