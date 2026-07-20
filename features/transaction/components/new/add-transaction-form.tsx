"use client"

import { FieldGroup } from "@/components/ui/field"
import { cn } from "@/shared/utils"
import { IWallet } from "@/types/wallet"
import { Mic, Save } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DateField from "./date-field"
import AmountField from "./amount-field"
import WalletField from "./wallet-field"
import CategoryField from "./category-field"
import NotesField from "./notes-field"
import { Button } from "@/components/ui/button"
import { ICategory } from "@/features/category/lib/queries/get-categories"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import {
  transactionSchema,
  TransactionFormValues,
} from "@/shared/schemas/transaction.schema"
import { saveTransaction } from "@/features/transaction/lib/actions/save-transaction"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"
import { Spinner } from "@/components/ui/spinner"
import { z } from "zod"

interface Props {
  type: "income" | "expense"
  wallets: IWallet[]
  categories: ICategory[]
}

type TransactionFormInput = z.input<typeof transactionSchema>

export default function AddTransactionForm({
  type,
  wallets,
  categories,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const t = useTranslations("transaction")
  const isIncome = type === "income"

  const { handleSubmit, control } = useForm<
    TransactionFormInput,
    unknown,
    TransactionFormValues
  >({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      wallet_id: wallets[0]?.id ?? "",
      category_id: undefined,
      transaction_date: new Date(),
      notes: "",
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

      const result = await saveTransaction(formData)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.push("/home")
    })
  }

  const formId = `add-trx-form-${type}`

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

      <div className="fixed inset-x-2 bottom-4 z-50 mx-auto flex max-w-lg items-center gap-2 py-2">
        <Button
          type="button"
          size="icon"
          className={cn(
            "size-12 shrink-0 text-primary-foreground",
            isIncome
              ? "bg-chart-2 hover:bg-chart-2/90"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          <Mic className="size-5" />
        </Button>

        <Button
          type="submit"
          form={formId}
          className={cn(
            "h-12 flex-1 text-primary-foreground",
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
