export interface ITransfer {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
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

export interface ITransferDetail {
  id: string
  amount: number
  notes: string | null
  transfer_date: string
  created_at: string
  updated_at: string
  from_wallet: {
    id: string
    name: string
    icon: string
    color: string
    balance: number
  }
  to_wallet: {
    id: string
    name: string
    icon: string
    color: string
    balance: number
  }
}

