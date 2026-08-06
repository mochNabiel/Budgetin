export interface IRecentTransaction {
  id: string
  notes: string | null
  type: "income" | "expense"
  amount: number
  transaction_date: string
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
}

