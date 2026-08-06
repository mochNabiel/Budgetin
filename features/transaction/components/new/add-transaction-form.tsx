import { IWallet } from "@/types/wallet"
import { createTransaction } from "@/features/transaction/lib/actions/create-transaction"
import TransactionForm from "../transaction-form"
import { ICategory } from "@/types/category"

interface Props {
  type: "income" | "expense"
  wallets: IWallet[]
  categories: ICategory[]
}

export default function AddTransactionForm({
  type,
  wallets,
  categories,
}: Props) {
  return (
    <TransactionForm
      mode="create"
      type={type}
      wallets={wallets}
      categories={categories}
      onSubmitAction={createTransaction}
      onSuccessRedirect="/home"
    />
  )
}
