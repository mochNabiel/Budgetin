export interface ITransactionDetail {
  id: string
  type: "income" | "expense"
  amount: number
  notes: string | null
  attachment_url: string | null
  transaction_date: string
  created_at: string
  updated_at: string
  wallet: {
    id: string
    name: string
    icon: string
    color: string
    balance: number
  }
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

