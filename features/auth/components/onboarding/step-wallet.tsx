"use client"

import { useState, useTransition } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { ArrowLeft } from "lucide-react"

import {
  walletSchema, WalletFormValues
} from "@/shared/schemas/wallet.schema"
import { createWallet } from "@/features/wallet/lib/actions/create-wallet"
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
import { ITEM_COLORS } from "@/constants/item-colors"
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

interface StepWalletProps {
  currencyCode: string
  onBack: () => void
}

export function StepWallet({ currencyCode, onBack }: StepWalletProps) {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("auth.onboarding")

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
      balance: 0,
      icon: "💰",
      color: ITEM_COLORS[0].value,
    },
  })

  function onSubmit(values: WalletFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => {
        formData.set(k, String(v))
      })
      formData.set("context", "onboarding")
      await createWallet(formData)
    })
  }

  const selectedColor = useWatch({ control, name: "color" })
  const selectedIcon = useWatch({ control, name: "icon" })
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
          {/* Preview wallet card */}
          <Field>
            <FieldLabel>Preview</FieldLabel>
            <Item
              variant="outline"
              className="flex flex-col items-start gap-2 border-none px-6"
              style={{
                backgroundColor: `${selectedColor}30`,
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
                  {formatCurrency(balance, currencyCode)}
                </ItemDescription>
              </ItemContent>
            </Item>
          </Field>

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
                        className="rounded-xl p-6"
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
                    className="flex-1 rounded-xl py-6"
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

          {/* Initial Balance */}
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
                    {getCurrencySymbol(currencyCode)}
                  </span>
                  <Input
                    id="balance"
                    inputMode="numeric"
                    className="rounded-xl py-6 pl-14"
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
                  {ITEM_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => field.onChange(c.value)}
                      aria-label={c.label}
                      className={cn(
                        "size-10 rounded-full border-2 transition-transform hover:scale-110",
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

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0"
              onClick={onBack}
              disabled={isPending}
              aria-label="back"
            >
              <ArrowLeft className="size-4" />
            </Button>

            <Button type="submit" disabled={isPending} className="h-12 flex-1">
              {isPending ? t("saving") : t("start")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
