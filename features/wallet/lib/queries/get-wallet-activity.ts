import { cache } from "react"

import { getUserData } from "@/features/auth/lib/queries"
import { createClient } from "@/shared/supabase/server"
import { WalletActivityItem } from "@/types/wallet-activity"

export type {
  IWalletTransactionActivity,
  IWalletTransferActivity,
  WalletActivityItem,
} from "@/types/wallet-activity"

function activitySortKey(date: string, createdAt: string) {
  return `${date}T${createdAt}`
}

export const getWalletActivity = cache(async (walletId: string) => {
  const supabase = await createClient()
  const user = await getUserData()

  const [transactionsResult, transfersResult] = await Promise.all([
    supabase
      .from("transactions")
      .select(
        `
        id,
        type,
        amount,
        notes,
        transaction_date,
        created_at,
        category:categories (
          id,
          name,
          icon,
          color
        )
      `
      )
      .eq("user_id", user.id)
      .eq("wallet_id", walletId)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("transfers")
      .select(
        `
        id,
        amount,
        notes,
        transfer_date,
        created_at,
        from_wallet_id,
        to_wallet_id,
        from_wallet:wallets!transfers_from_wallet_id_fkey ( id, name, icon, color ),
        to_wallet:wallets!transfers_to_wallet_id_fkey ( id, name, icon, color )
      `
      )
      .eq("user_id", user.id)
      .or(`from_wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`)
      .order("transfer_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ])

  if (transactionsResult.error) throw new Error(transactionsResult.error.message)
  if (transfersResult.error) throw new Error(transfersResult.error.message)

  const transactions = (transactionsResult.data ?? []).map(
    (item) =>
      ({
        ...item,
        item_type: "transaction" as const,
      }) as unknown as WalletActivityItem
  )

  const transfers = (transfersResult.data ?? []).map(
    (item) =>
      ({
        ...item,
        item_type: "transfer" as const,
        kind:
          item.from_wallet_id === walletId
            ? ("out" as const)
            : ("in" as const),
      }) as unknown as WalletActivityItem
  )

  return [...transactions, ...transfers].sort((a, b) => {
    const aKey =
      a.item_type === "transaction"
        ? activitySortKey(a.transaction_date, a.created_at)
        : activitySortKey(a.transfer_date, a.created_at)
    const bKey =
      b.item_type === "transaction"
        ? activitySortKey(b.transaction_date, b.created_at)
        : activitySortKey(b.transfer_date, b.created_at)
    return bKey.localeCompare(aKey)
  })
})
