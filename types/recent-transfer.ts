export interface IRecentTransfer {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
  from_wallet: { id: string; name: string; icon: string; color: string }
  to_wallet: { id: string; name: string; icon: string; color: string }
}

