export interface IWalletTransactionActivity {
  id: string
  type: "income" | "expense"
  amount: number
  notes: string | null
  transaction_date: string
  created_at: string
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

export interface IWalletTransferActivity {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
  created_at: string
  kind: "in" | "out"
  from_wallet: {
    id: string
    name: string
    icon: string
    color: string
  }
  to_wallet: {
    id: string
    name: string
    icon: string
    color: string
  }
}

export type WalletActivityItem =
  | (IWalletTransactionActivity & { item_type: "transaction" })
  | (IWalletTransferActivity & { item_type: "transfer" })

