"use client"

import { useState, useTransition } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { toast } from "sonner"

import { walletSchema, WalletFormValues } from "@/shared/schemas/wallet.schema"
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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/shared/utils"
import { WALLET_COLORS } from "@/constants/wallet-colors"
import { useUser } from "@/components/global/user-provider"
import formatCurrency, {
  getCurrencySymbol,
} from "@/shared/helper/format-currency"
import { Spinner } from "@/components/ui/spinner"
import { ActionState } from "@/types"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

interface Props {
  mode: "create" | "edit"
  defaultValues?: Partial<WalletFormValues>
  onSubmitAction: (formData: FormData) => Promise<ActionState>
}

export default function WalletForm({
  mode,
  defaultValues,
  onSubmitAction,
}: Props) {
  const t = useTranslations("wallet")
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { currency } = useUser()
  const router = useRouter()

  const { handleSubmit, control } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      balance: defaultValues?.balance ?? 0,
      icon: defaultValues?.icon ?? "💰",
      color: defaultValues?.color ?? WALLET_COLORS[0].value,
    },
  })

  const walletName = useWatch({ control, name: "name" })
  const balance = useWatch({ control, name: "balance" })
  const selectedIcon = useWatch({ control, name: "icon" })
  const selectedColor = useWatch({ control, name: "color" })

  function onSubmit(values: WalletFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => formData.set(k, String(v)))

      const result = await onSubmitAction(formData)

      if (!result.success) {
        toast.error(result.message ?? "Something went wrong")
        return
      }

      toast.success(result.message ?? "Success")
      router.push("/home")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {/* Preview */}
          <Field>
            <FieldLabel>Preview</FieldLabel>
            <Item
              variant="outline"
              className="flex w-fit flex-col items-start gap-2 border-none px-6"
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
                <ItemTitle className="text-sm font-light">
                  {walletName || t("name_placeholder")}
                </ItemTitle>
                <ItemDescription className="text-lg font-semibold text-foreground">
                  {formatCurrency(balance || 0, currency)}
                </ItemDescription>
              </ItemContent>
            </Item>
          </Field>
          
          {/* Icon + Nama */}
          <Field>
            <FieldLabel>{t("name_icon")}</FieldLabel>
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
                    placeholder={t("name_placeholder")}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />
            </div>
          </Field>

          {/* Balance */}
          <Controller
            name="balance"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="wallet-balance">
                  {mode === "create" ? t("initial_balance") : t("balance")}
                </FieldLabel>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    {getCurrencySymbol(currency)}
                  </span>
                  <Input
                    id="wallet-balance"
                    inputMode="numeric"
                    className="rounded-xl py-6 pl-14"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                    aria-invalid={fieldState.invalid}
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
            name="color"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t("color")}</FieldLabel>
                <div className="flex flex-wrap gap-3">
                  {WALLET_COLORS.map((c) => (
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

          <Button type="submit" disabled={isPending} className="h-12 w-full">
            {isPending ? (
              <Spinner />
            ) : mode === "create" ? (
              t("add_wallet")
            ) : (
              t("save")
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
