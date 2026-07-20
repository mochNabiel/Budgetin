"use client"

import { useTransition } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpDown, Send } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { z } from "zod"

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import AmountField from "@/features/transaction/components/new/amount-field"
import DateField from "@/features/transaction/components/new/date-field"
import TransferWalletSelect from "./transfer-wallet-select"
import {
  transferSchema,
  TransferFormValues,
} from "@/shared/schemas/transfer.schema"
import { createTransfer } from "../lib/actions/create-transfer"
import { IWallet } from "@/types/wallet"
import { useRouter } from "@/i18n/navigation"
import { useUser } from "@/components/global/user-provider"

interface Props {
  wallets: IWallet[]
}

type TransferFormInput = z.input<typeof transferSchema>

const formId = "add-transfer-form"

export default function AddTransferForm({ wallets }: Props) {
  const { currency } = useUser()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations("transfer.new")

  const { handleSubmit, control, setValue } = useForm<
    TransferFormInput,
    unknown,
    TransferFormValues
  >({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from_wallet_id: wallets[0]?.id ?? "",
      to_wallet_id: wallets[1]?.id ?? "",
      amount: undefined,
      transfer_date: new Date(),
      notes: "",
    },
  })

  const fromId = useWatch({
    control,
    name: "from_wallet_id",
  })

  const toId = useWatch({
    control,
    name: "to_wallet_id",
  })

  function handleSwap() {
    setValue("from_wallet_id", toId)
    setValue("to_wallet_id", fromId)
  }

  function onSubmit(values: TransferFormValues) {
    startTransition(async () => {
      const formData = new FormData()

      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof Date) {
          formData.set(k, v.toISOString())
        } else if (v !== undefined) {
          formData.set(k, String(v))
        }
      })

      const result = await createTransfer(formData)

      if (!result.success) {
        toast.error(result.message ?? "Something went wrong")
        return
      }

      toast.success(result.message ?? "Transfer successful")
      router.push("/home")
    })
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="pb-28">
      <FieldGroup className="gap-4">
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <AmountField field={field} fieldState={fieldState} type="expense" />
          )}
        />

        <div className="relative flex flex-col gap-4">
          <Controller
            name="from_wallet_id"
            control={control}
            render={({ field, fieldState }) => (
              <TransferWalletSelect
                field={field}
                fieldState={fieldState}
                wallets={wallets}
                excludeId={toId}
                label={t("from_wallet")}
                formId={formId}
                currency={currency}
              />
            )}
          />

          <Controller
            name="to_wallet_id"
            control={control}
            render={({ field, fieldState }) => (
              <TransferWalletSelect
                field={field}
                fieldState={fieldState}
                wallets={wallets}
                excludeId={fromId}
                label={t("to_wallet")}
                formId={formId}
                currency={currency}
              />
            )}
          />

          <button
            type="button"
            onClick={handleSwap}
            aria-label={t("swap")}
            className="absolute top-1/2 left-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-foreground text-background transition-all duration-300 hover:scale-105 hover:rotate-180"
          >
            <ArrowUpDown className="size-5" />
          </button>
        </div>

        <Controller
          name="transfer_date"
          control={control}
          render={({ field, fieldState }) => (
            <DateField field={field} fieldState={fieldState} type="expense" />
          )}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor={`${formId}-notes`} className="font-normal">
                {t("notes")}
              </FieldLabel>
              <Textarea
                {...field}
                id={`${formId}-notes`}
                aria-invalid={fieldState.invalid}
                placeholder={t("notes_placeholder")}
                className="min-h-24"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="fixed inset-x-2 bottom-4 z-50 mx-auto max-w-lg py-2">
        <Button
          type="submit"
          form={formId}
          className="h-12 w-full"
          disabled={isPending}
        >
          {!isPending ? (
            <>
              <Send className="size-5" />
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
