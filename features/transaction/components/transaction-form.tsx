"use client"

import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mic, Save } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FieldGroup } from "@/components/ui/field"
import { cn } from "@/shared/utils"
import { IWallet } from "@/types/wallet"
import { ICategory } from "@/types/category"
import {
  transactionSchema,
  TransactionFormValues,
} from "@/shared/schemas/transaction.schema"
import { useRouter } from "@/i18n/navigation"
import { ActionState } from "@/types"

import DateField from "@/components/global/date-field"
import AmountField from "./new/amount-field"
import WalletField from "./new/wallet-field"
import CategoryField from "./new/category-field"
import NotesField from "./new/notes-field"

export type TransactionFormMode = "create" | "edit"

export type TransactionFormInput = z.input<typeof transactionSchema>

interface Props {
  mode: TransactionFormMode
  type: "income" | "expense"
  wallets: IWallet[]
  categories: ICategory[]
  defaultValues?: Partial<TransactionFormInput>
  onSubmitAction: (formData: FormData) => Promise<ActionState>
  submitLabel?: string
  onSuccessRedirect?: string
}

export default function TransactionForm({
  mode,
  type,
  wallets,
  categories,
  defaultValues,
  onSubmitAction,
  submitLabel,
  onSuccessRedirect = "/home",
}: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations("transaction")
  const isIncome = type === "income"

  const form = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: defaultValues?.amount,
      wallet_id: defaultValues?.wallet_id ?? wallets[0]?.id ?? "",
      category_id: defaultValues?.category_id,
      transaction_date: defaultValues?.transaction_date ?? new Date(),
      notes: defaultValues?.notes ?? "",
      type,
    },
  })

  const { handleSubmit, control } = form

  function onSubmit(values: TransactionFormValues) {
    startTransition(async () => {
      const formData = new FormData()

      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof Date) {
          formData.set(k, v.toISOString())
          return
        }

        if (v !== undefined) {
          formData.set(k, String(v))
        }
      })

      const result = await onSubmitAction(formData)

      if (!result.success) {
        toast.error(result.message ?? "Something went wrong")
        return
      }

      toast.success(result.message ?? t("save"))
      router.push(onSuccessRedirect)
    })
  }

  const formId = `${mode}-trx-form-${type}`

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

      <div className="fixed inset-x-2 max-w-lg bottom-4 bg-background z-50 mx-auto flex items-center gap-2 py-2">
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
              {submitLabel ?? t("save")}
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
