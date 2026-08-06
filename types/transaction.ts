export interface ITransaction {
  id: string
  notes: string | null
  type: "income" | "expense"
  amount: number
  transaction_date: string
  wallet: {
    id: string
    name: string
    icon: string
    color: string
  }
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

