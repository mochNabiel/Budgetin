"use client"

import { useState, useTransition } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"

import {
  initialWalletSchema,
  InitialWalletFormValues,
} from "@/shared/schemas/wallet.schema"
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
import AuthHeading from "../auth-heading"
import { useTranslations } from "next-intl"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import formatCurrency, {
  getCurrencySymbol,
} from "@/shared/helper/format-currency"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

export function StepWallet() {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("auth.onboarding")

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InitialWalletFormValues>({
    resolver: zodResolver(initialWalletSchema),
    defaultValues: {
      name: t("wallet_name_placeholder"),
      balance: 0,
      currency: CURRENCIES[0].code,
      icon: "💰",
      color: WALLET_COLORS[0].value,
    },
  })

  function onSubmit(values: InitialWalletFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => {
        formData.set(k, String(v))
      })
      await saveWallet(formData)
    })
  }

  const selectedColor = useWatch({ control, name: "color" })
  const selectedIcon = useWatch({ control, name: "icon" })
  const selectedCurrencyCode = useWatch({ control, name: "currency" })
  const walletName = useWatch({ control, name: "name" })
  const balance = useWatch({ control, name: "balance" })

  return (
    <div className="flex flex-col gap-6">
      <AuthHeading
        title={t("step2_title")}
        description={t("step2_description")}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {/* Currency */}
          <Controller
            control={control}
            name="currency"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel>{t("currency")}</FieldLabel>
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
                      <span className="text-xs font-semibold">
                        {getCurrencySymbol(c.code)}
                      </span>
                      <span className="text-[10px] opacity-70">{c.name}</span>
                    </button>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Icon + Nama — satu baris */}
          <Field>
            <FieldLabel>{t("wallet_name_icon")}</FieldLabel>

            <div className="flex gap-2">
              <Controller
                name="icon"
                control={control}
                render={({ field, fieldState }) => (
                  <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        aria-invalid={fieldState.invalid}
                      >
                        {field.value}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          field.onChange(e.emoji)
                          setEmojiOpen(false)
                        }}
                        skinTonesDisabled
                        height={350}
                        width={300}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    className="flex-1"
                    placeholder={t("wallet_name_placeholder")}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />
            </div>

            {(errors.icon || errors.name) && (
              <FieldError>
                {errors.icon?.message ?? errors.name?.message}
              </FieldError>
            )}
          </Field>

          {/* Balance */}
          <Controller
            control={control}
            name="balance"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="balance">
                  {t("initial_balance")}
                </FieldLabel>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    {getCurrencySymbol(selectedCurrencyCode)}
                  </span>
                  <Input
                    id="balance"
                    inputMode="numeric"
                    className="pl-14"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Warna */}
          <Controller
            control={control}
            name="color"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t("wallet_color")}</FieldLabel>
                <div className="flex flex-wrap gap-3">
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Preview wallet card */}
          <Field>
            <FieldLabel>Preview</FieldLabel>
            <Item
              variant="outline"
              className="flex flex-col items-start gap-2 px-6"
              style={{
                borderColor: selectedColor,
                backgroundColor: `${selectedColor}20`,
              }}
            >
              <ItemMedia
                variant="icon"
                className="size-9 rounded-full text-lg"
                style={{ backgroundColor: selectedColor }}
              >
                {selectedIcon}
              </ItemMedia>

              <ItemContent className="gap-0">
                <ItemTitle className="text-xs font-medium tracking-wide text-muted-foreground">
                  {walletName}
                </ItemTitle>
                <ItemDescription className="text-lg font-semibold text-foreground">
                  {formatCurrency(balance, selectedCurrencyCode)}
                </ItemDescription>
              </ItemContent>
            </Item>
          </Field>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? t("saving") : t("start")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
