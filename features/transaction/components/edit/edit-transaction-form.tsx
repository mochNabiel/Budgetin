"use client"

import { FieldGroup } from "@/components/ui/field"
import { cn } from "@/shared/utils"
import { IWallet } from "@/types/wallet"
import { Save } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DateField from "../new/date-field"
import AmountField from "../new/amount-field"
import WalletField from "../new/wallet-field"
import CategoryField from "../new/category-field"
import NotesField from "../new/notes-field"
import { Button } from "@/components/ui/button"
import { ICategory } from "@/features/category/lib/queries/get-categories"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import {
  transactionSchema,
  TransactionFormValues,
} from "@/shared/schemas/transaction.schema"
import { updateTransaction } from "@/features/transaction/lib/actions/update-transaction"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"
import { Spinner } from "@/components/ui/spinner"
import { z } from "zod"
import { ITransactionDetail } from "@/features/transaction/lib/queries/get-transaction-detail"

interface Props {
  transaction: ITransactionDetail
  wallets: IWallet[]
  categories: ICategory[]
}

type TransactionFormInput = z.input<typeof transactionSchema>

export default function EditTransactionForm({
  transaction,
  wallets,
  categories,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const t = useTranslations("transaction")
  const type = transaction.type
  const isIncome = type === "income"

  const { handleSubmit, control } = useForm<
    TransactionFormInput,
    unknown,
    TransactionFormValues
  >({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction.amount,
      wallet_id: transaction.wallet.id,
      category_id: transaction.category.id,
      transaction_date: new Date(transaction.transaction_date),
      notes: transaction.notes ?? "",
      type,
    },
  })

  function onSubmit(values: TransactionFormValues) {
    startTransition(async () => {
      const formData = new FormData()

      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof Date) {
          formData.set(k, v.toISOString())
        } else if (v !== undefined) {
          formData.set(k, String(v))
        }
      })

      const result = await updateTransaction(transaction.id, formData)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.push(`/transaction/${transaction.id}`)
    })
  }

  const formId = `edit-trx-form-${transaction.id}`

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="pb-28">
      <FieldGroup className="gap-4">
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <AmountField field={field} fieldState={fieldState} type={type} />
          )}
        />

        <Controller
          name="wallet_id"
          control={control}
          render={({ field, fieldState }) => (
            <WalletField
              field={field}
              fieldState={fieldState}
              type={type}
              wallets={wallets}
              formId={formId}
            />
          )}
        />

        <Controller
          name="category_id"
          control={control}
          render={({ field, fieldState }) => (
            <CategoryField
              field={field}
              fieldState={fieldState}
              categories={categories}
              formId={formId}
            />
          )}
        />

        <Controller
          name="transaction_date"
          control={control}
          render={({ field, fieldState }) => (
            <DateField field={field} fieldState={fieldState} type={type} />
          )}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState }) => (
            <NotesField field={field} fieldState={fieldState} formId={formId} />
          )}
        />
      </FieldGroup>

      <div className="fixed inset-x-2 bottom-4 z-50 mx-auto max-w-lg py-2">
        <Button
          type="submit"
          form={formId}
          className={cn(
            "h-12 w-full text-primary-foreground",
            isIncome
              ? "bg-chart-2 hover:bg-chart-2/90"
              : "bg-primary hover:bg-primary/90"
          )}
          disabled={isPending}
        >
          {!isPending ? (
            <>
              <Save className="size-5" />
              {t("save")}
            </>
          ) : (
            <>
              <Spinner />
              {t("saving")}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
