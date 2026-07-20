"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/shared/utils"
import { WALLET_COLORS } from "@/constants/wallet-colors"
import {
  categorySchema,
  CategoryFormValues,
} from "@/shared/schemas/category.schema"
import { ActionState } from "@/types"
import { useRouter } from "@/i18n/navigation"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

interface Props {
  mode: "create" | "edit"
  defaultValues?: Partial<CategoryFormValues>
  onSubmitAction: (formData: FormData) => Promise<ActionState>
}

export default function CategoryForm({
  mode,
  defaultValues,
  onSubmitAction,
}: Props) {
  const t = useTranslations("category")
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { handleSubmit, control } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: defaultValues?.type ?? "expense",
      name: defaultValues?.name ?? "",
      icon: defaultValues?.icon ?? "🏷️",
      color: defaultValues?.color ?? WALLET_COLORS[0].value,
    },
  })

  const selectedType = useWatch({ control, name: "type" })
  const selectedName = useWatch({ control, name: "name" })
  const selectedIcon = useWatch({ control, name: "icon" })
  const selectedColor = useWatch({ control, name: "color" })

  function onSubmit(values: CategoryFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => formData.set(k, String(v)))

      const result = await onSubmitAction(formData)

      if (!result.success) {
        toast.error(result.message ?? "Something went wrong")
        return
      }

      toast.success(result.message ?? "Success")
      router.push("/category")
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup className="gap-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>{t("type")}</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(value)}
                    className={cn(
                      "rounded-xl border py-3 text-sm font-medium",
                      field.value === value
                        ? value === "income"
                          ? "border-chart-2 bg-chart-2/10 text-chart-2"
                          : "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {t(value)}
                  </button>
                ))}
              </div>
            </Field>
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>{t("name")}</FieldLabel>
              <Input
                {...field}
                placeholder={t("name_placeholder")}
                className="rounded-xl py-6"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="icon"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>{t("icon")}</FieldLabel>
              <div className="flex items-center gap-2">
                <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="size-12 rounded-xl text-lg"
                      aria-label={t("icon")}
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
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>{t("color")}</FieldLabel>
              <div className="grid grid-cols-6 gap-3">
                {WALLET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => field.onChange(c.value)}
                    className={cn(
                      "size-10 rounded-full border-2 transition-transform hover:scale-110",
                      field.value === c.value
                        ? "scale-110 border-foreground"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: c.value }}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Preview</FieldLabel>
          <Item
            variant="outline"
            className="flex w-full items-center gap-3 px-4 py-3"
          >
            <ItemMedia
              variant="icon"
              className="size-11 rounded-full text-xl"
              style={{ backgroundColor: selectedColor }}
            >
              {selectedIcon}
            </ItemMedia>
            <ItemContent className="gap-0">
              <ItemTitle className="text-sm font-semibold">
                {selectedName || t("name_placeholder")}
              </ItemTitle>
              <ItemDescription
                className={cn(
                  "text-xs font-medium capitalize",
                  selectedType === "income" ? "text-chart-2" : "text-primary"
                )}
              >
                {selectedType}
              </ItemDescription>
            </ItemContent>
          </Item>
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="h-12 w-full">
        {isPending ? (
          <Spinner />
        ) : mode === "create" ? (
          t("create")
        ) : (
          t("update")
        )}
      </Button>
    </form>
  )
}
