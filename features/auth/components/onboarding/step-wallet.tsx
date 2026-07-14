"use client"

import { useState, useTransition } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { Smile } from "lucide-react"

import { walletSchema, WalletFormValues } from "@/shared/schemas/wallet.schema"
import { saveWallet } from "@/features/auth/lib/actions/save-wallet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/shared/utils"
import { CURRENCIES } from "@/constants/currencies"
import { WALLET_COLORS } from "@/constants/wallet-colors"
import { formatThousands } from "@/shared/helper/format-thousand"
import AuthHeading from "../auth-heading"
import { useTranslations } from "next-intl"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

export function StepWallet() {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("auth.onboarding")

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: t("wallet_name_placeholder"),
      balance: "0",
      currency: CURRENCIES[0].code,
      icon: "💰",
      color: WALLET_COLORS[0].value,
    },
  })

  function onSubmit(values: WalletFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => formData.set(k, v))

      const result = await saveWallet(formData)

      if (!result.success) {
        setError("root", { message: result.message })
      }
    })
  }

  const selectedColor = useWatch({ control, name: "color" })
  const selectedIcon = useWatch({ control, name: "icon" })
  const selectedCurrencyCode = useWatch({ control, name: "currency" })
  const walletName = useWatch({ control, name: "name" })
  const balance = useWatch({ control, name: "balance" })

  // derive simbol dari code yang tersimpan, untuk ditampilkan ke user
const selectedCurrencySymbol =
  CURRENCIES.find((c) => c.code === selectedCurrencyCode)?.symbol ?? ""

  return (
    <div className="flex flex-col gap-6">
      <AuthHeading
        title={t("step2_title")}
        description={t("step2_description")}
      />

      {/* Preview wallet card */}
      <div
        className="flex items-center gap-3 rounded-2xl p-4 text-white shadow-md transition-colors"
        style={{ backgroundColor: selectedColor }}
      >
        <span className="text-3xl">{selectedIcon}</span>
        <div>
          <p className="leading-tight font-semibold">
            {walletName || "Nama Wallet"}
          </p>
          <p className="text-sm opacity-80">
            {selectedCurrencySymbol} {formatThousands(balance)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {/* Currency */}
          <Field>
            <FieldLabel>{t("currency")}</FieldLabel>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <div className="grid grid-cols-5 gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => field.onChange(c.code)}
                      className={cn(
                        "flex flex-col items-center rounded-xl border px-2 py-2.5 text-center transition-colors",
                        field.value === c.code
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <span className="text-xs font-semibold">{c.symbol}</span>
                      <span className="text-[10px] opacity-70">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.currency && (
              <FieldError>{errors.currency.message}</FieldError>
            )}
          </Field>

          {/* Icon + Nama — satu baris */}
          <Field>
            <FieldLabel>{t("wallet_name_icon")}</FieldLabel>
            <div className="flex gap-2">
              <Controller
                control={control}
                name="icon"
                render={({ field }) => (
                  <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {field.value || (
                          <Smile className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          field.onChange(e.emoji)
                          setEmojiOpen(false)
                        }}
                        skinTonesDisabled
                        searchDisabled={false}
                        height={350}
                        width={300}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <div className="flex-1">
                <Input
                  placeholder={t("wallet_name_placeholder")}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
            </div>
            {errors.icon && <FieldError>{errors.icon.message}</FieldError>}
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          {/* Saldo awal */}
          <Field>
            <FieldLabel htmlFor="balance">{t("initial_balance")}</FieldLabel>
            <Controller
              control={control}
              name="balance"
              render={({ field }) => (
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    {selectedCurrencySymbol}
                  </span>
                  <Input
                    id="balance"
                    inputMode="numeric"
                    className="pl-14"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(formatThousands(e.target.value))
                    }
                  />
                </div>
              )}
            />
            {errors.balance && (
              <FieldError>{errors.balance.message}</FieldError>
            )}
          </Field>

          {/* Warna */}
          <Field>
            <FieldLabel>{t("wallet_color")}</FieldLabel>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex gap-3">
                  {WALLET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => field.onChange(c.value)}
                      aria-label={c.label}
                      className={cn(
                        "size-8 rounded-full border-2 transition-transform hover:scale-110",
                        field.value === c.value
                          ? "scale-110 border-foreground"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              )}
            />
            {errors.color && <FieldError>{errors.color.message}</FieldError>}
          </Field>

          {errors.root && (
            <FieldError className="text-center">
              {errors.root.message}
            </FieldError>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? t("saving") : t("start")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
