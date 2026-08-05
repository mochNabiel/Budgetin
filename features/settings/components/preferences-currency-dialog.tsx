"use client"

import { useTransition } from "react"
import { Check, ChevronRight, Coins } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CURRENCIES } from "@/constants/currencies"
import { updateCurrency } from "@/features/settings/lib/actions/update-currency"
import { getCurrencySymbol } from "@/shared/helper/format-currency"
import { handleActionResult } from "@/shared/lib/handle-action-result"
import { cn } from "@/shared/utils"
import { useRouter } from "@/i18n/navigation"
import { useUser } from "@/components/global/user-provider"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PreferencesCurrencyDialog({
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations("settings.preferences")
  const user = useUser()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentCurrency = user.currency
  const selectedCurrency =
    CURRENCIES.find((currency) => currency.code === currentCurrency) ??
    CURRENCIES[0]

  function handleSelect(currencyCode: string) {
    startTransition(async () => {
      const result = await updateCurrency(currencyCode)
      const handled = await handleActionResult(result, {
        errorMessage: t("errors.update_currency_failed"),
        onError: (message) => {
          toast.error(message)
        },
        onSuccess: async () => {
          toast.success(t("messages.currency_updated"))
          onOpenChange(false)
          router.refresh()
        },
      })

      if (!handled.success) {
        return
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 border-t px-4 py-4 text-left transition-colors hover:bg-muted/40"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
            <Coins className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{t("currency")}</p>
            <p className="text-sm text-muted-foreground">
              {selectedCurrency.code} - {selectedCurrency.name}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("select_currency")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {CURRENCIES.map((currency) => {
            const selected = currency.code === selectedCurrency.code
            return (
              <button
                key={currency.code}
                type="button"
                disabled={isPending}
                onClick={() => handleSelect(currency.code)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-sm font-semibold">
                  {getCurrencySymbol(currency.code)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{currency.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {currency.name}
                  </p>
                </div>
                {selected && <Check className="size-4 text-primary" />}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
