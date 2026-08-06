"use client"

import { useState } from "react"
import formatCurrency from "@/shared/helper/format-currency"
import { Field, FieldError } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IWallet } from "@/types/wallet"
import { Check } from "lucide-react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form"

interface Props<T extends FieldValues = FieldValues> {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  wallets: IWallet[]
  label: string
  excludeId?: string
  formId: string
  currency: string
}

export default function TransferWalletSelect<
  T extends FieldValues = FieldValues,
>({
  field,
  fieldState,
  wallets,
  label,
  excludeId,
  formId,
  currency,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const selectedWallet = wallets.find((wallet) => wallet.id === field.value)

  function handleSelect(id: string) {
    field.onChange(id)
    setOpen(false)
  }

  return (
    <Field data-invalid={fieldState.invalid} className="gap-0">
      <button
        type="button"
        id={`${formId}-${field.name}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="w-full rounded-3xl text-left transition-transform active:scale-[0.98]"
      >
        {selectedWallet ? (
          <div
            className="flex w-full flex-col gap-4 rounded-3xl border-2 p-5 transition-all"
            style={{
              backgroundColor: `${selectedWallet.color}20`,
              borderColor: selectedWallet.color,
            }}
          >
            <span className="text-sm font-medium">{label}</span>

            <div className="flex items-center gap-4">
              <span
                className="flex size-14 shrink-0 items-center justify-center rounded-full text-2xl"
                style={{ backgroundColor: selectedWallet.color }}
              >
                {selectedWallet.icon}
              </span>

              <div className="text-left">
                <p className="text-lg font-semibold">{selectedWallet.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(selectedWallet.balance, currency)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-dashed p-5 text-muted-foreground">
            <span className="text-sm font-medium">{label}</span>
            <span>{label}</span>
          </div>
        )}
      </button>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="border-b p-4">
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {wallets.map((wallet) => {
              const isSelected = wallet.id === field.value
              const isDisabled = wallet.id === excludeId

              return (
                <button
                  key={wallet.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(wallet.id)}
                  className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors enabled:hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-full text-xl"
                    style={{ backgroundColor: wallet.color }}
                  >
                    {wallet.icon}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{wallet.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(wallet.balance, currency)}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="size-5 shrink-0 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Field>
  )
}
