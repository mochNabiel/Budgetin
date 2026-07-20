"use client"

import { useUser } from "@/components/global/user-provider"
import { Field, FieldError } from "@/components/ui/field"
import { getCurrencySymbol } from "@/shared/helper/format-currency"
import { cn } from "@/shared/utils"
import { useTranslations } from "next-intl"
import { useState } from "react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form"

function formatAmount(value: number) {
  if (!value) return ""
  return new Intl.NumberFormat("id-ID").format(value)
}

function parseAmount(raw: string) {
  const digitsOnly = raw.replace(/\D/g, "")
  return digitsOnly ? Number(digitsOnly) : 0
}

interface AmountFieldProps<T extends FieldValues = FieldValues> {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  type: "income" | "expense"
}

export default function AmountField<T extends FieldValues = FieldValues>({
  field,
  fieldState,
  type,
}: AmountFieldProps<T>) {
  const { currency } = useUser()
  const t = useTranslations("transaction")
  const isIncome = type === "income"
  const [focused, setFocused] = useState(false)

  const numericValue: number = field.value || 0
  const displayValue = formatAmount(numericValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(parseAmount(e.target.value))
  }

  return (
    <Field data-invalid={fieldState.invalid} className="gap-2">
      <div
        className={cn(
          "rounded-2xl border bg-input/30 px-4 py-6 transition-colors",
          focused &&
            (isIncome
              ? "border-chart-2 ring-2 ring-chart-2/20"
              : "border-primary ring-2 ring-primary/20"),
          fieldState.invalid && "border-destructive"
        )}
      >
        <p className="text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {t("amount")}
        </p>

        <div className="mt-2 flex items-center justify-center gap-2">
          <span
            className={cn(
              "shrink-0 text-lg font-medium",
              numericValue ? "text-foreground" : "text-muted-foreground/50"
            )}
          >
            {getCurrencySymbol(currency)}
          </span>

          <input
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              field.onBlur()
            }}
            placeholder="0"
            aria-invalid={fieldState.invalid}
            size={Math.max(1, displayValue.length || 1)}
            className={cn(
              "max-w-full bg-transparent text-center text-4xl font-bold tabular-nums outline-none",
              "placeholder:text-muted-foreground/30",
              isIncome ? "text-chart-2" : "text-primary"
            )}
          />
        </div>
      </div>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
