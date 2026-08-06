export interface ICategory {
  id: number
  user_id: string | null
  type: "income" | "expense"
  name: string
  icon: string
  color: string
  created_at: string
}