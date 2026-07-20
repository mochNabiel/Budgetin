"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUser } from "@/components/global/user-provider"
import formatCurrency from "@/shared/helper/format-currency"
import { cn } from "@/shared/utils"
import { IWallet } from "@/types/wallet"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form"
import { useTranslations } from "next-intl"

interface WalletFieldProps<T extends FieldValues = FieldValues> {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  type: "income" | "expense"
  wallets: IWallet[]
  formId: string
}

export default function WalletField<T extends FieldValues = FieldValues>({
  field,
  fieldState,
  type,
  wallets,
  formId,
}: WalletFieldProps<T>) {
  const { currency } = useUser()
  const t = useTranslations("transaction")
  const isIncome = type === "income"

  return (
    <Field className="gap-2">
      <FieldLabel className="font-normal">{t("wallet")}</FieldLabel>

      <RadioGroup
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        className="flex w-full scrollbar-none gap-3 overflow-x-auto"
      >
        {wallets.map((wallet, index) => (
          <label
            key={`${wallet.id}-${index}`}
            htmlFor={`${formId}-wallet-${index}`}
            className={cn(
              "shrink-0 cursor-pointer rounded-xl border p-4 transition-colors",
              isIncome
                ? "has-data-[state=checked]:border-chart-2 has-data-[state=checked]:bg-chart-2/5"
                : "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
            )}
          >
            <RadioGroupItem
              id={`${formId}-wallet-${index}`}
              value={wallet.id}
              className="hidden"
              aria-invalid={fieldState.invalid}
            />

            <div className="flex items-center gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: wallet.color }}
              >
                {wallet.icon}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium whitespace-nowrap">
                  {wallet.name}
                </p>

                <p className="text-sm whitespace-nowrap text-muted-foreground">
                  {formatCurrency(wallet.balance, currency)}
                </p>
              </div>
            </div>
          </label>
        ))}
      </RadioGroup>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
