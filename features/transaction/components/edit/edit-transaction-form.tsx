"use client"

import { ITransactionDetail } from "@/features/transaction/lib/queries/get-transaction-detail"
import { IWallet } from "@/types/wallet"
import { updateTransaction } from "@/features/transaction/lib/actions/update-transaction"
import TransactionForm from "../transaction-form"
import { ICategory } from "@/types/category"

interface Props {
  transaction: ITransactionDetail
  wallets: IWallet[]
  categories: ICategory[]
}

export default function EditTransactionForm({
  transaction,
  wallets,
  categories,
}: Props) {
  return (
    <TransactionForm
      mode="edit"
      type={transaction.type}
      wallets={wallets}
      categories={categories}
      defaultValues={{
        amount: transaction.amount,
        wallet_id: transaction.wallet.id,
        category_id: transaction.category.id,
        transaction_date: new Date(transaction.transaction_date),
        notes: transaction.notes ?? "",
      }}
      onSubmitAction={(formData) => updateTransaction(transaction.id, formData)}
      onSuccessRedirect={`/transaction/${transaction.id}`}
    />
  )
}
