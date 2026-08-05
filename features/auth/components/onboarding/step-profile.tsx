"use client"

import Image from "next/image"
import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "lucide-react"
import { useTranslations } from "next-intl"

import { CURRENCIES } from "@/constants/currencies"
import { getCurrencySymbol } from "@/shared/helper/format-currency"
import { cn } from "@/shared/utils"
import {
  profileSchema,
  ProfileFormValues,
} from "@/shared/schemas/profile.schema"
import { saveProfile } from "@/features/auth/lib/actions/save-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import AuthHeading from "../auth-heading"

interface Props {
  defaultName?: string
  defaultAvatar?: string
  onDone: (currencyCode: string) => void
}

export function StepProfile({ defaultName, defaultAvatar, onDone }: Props) {
  const [preview, setPreview] = useState<string | null>(defaultAvatar ?? null)
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("auth.onboarding")

  const { handleSubmit, control } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: defaultName ?? "",
      avatar: null,
      currency: CURRENCIES[0].code,
    },
  })

  function onSubmit(values: ProfileFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", values.full_name)
      formData.set("currency", values.currency)

      if (values.avatar) {
        formData.set("avatar", values.avatar)
      }

      await saveProfile(formData)

      onDone(values.currency)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AuthHeading
        title={t("step1_title")}
        description={t("step1_description")}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="avatar"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex flex-col items-center gap-3">
                  <div className="relative size-20 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <User className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline">
                    {preview ? t("change_photo") : t("upload_photo")}
                    <input
                      ref={field.ref}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        field.onChange(file)
                        if (file) setPreview(URL.createObjectURL(file))
                      }}
                    />
                  </label>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="full_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="full_name">{t("full_name")}</FieldLabel>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  aria-invalid={fieldState.invalid}
                  className="rounded-xl py-6"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t("currency")}</FieldLabel>
                <div className="grid grid-cols-5 gap-2">
                  {CURRENCIES.map((currency) => (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => field.onChange(currency.code)}
                      className={cn(
                        "flex flex-col items-center rounded-xl border px-2 py-2.5 text-center transition-colors",
                        field.value === currency.code
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <span className="text-xs font-semibold">
                        {getCurrencySymbol(currency.code)}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {currency.name}
                      </span>
                    </button>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isPending} className="h-12 w-full">
            {isPending ? t("saving") : t("continue")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
