"use client"

import Image from "next/image"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "lucide-react"

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
import { useTranslations } from "next-intl"

interface StepProfileProps {
  defaultName?: string
  defaultAvatar?: string
  onDone: () => void
}

export function StepProfile({
  defaultName,
  defaultAvatar,
  onDone,
}: StepProfileProps) {
  const [preview, setPreview] = useState<string | null>(defaultAvatar ?? null)
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("auth.onboarding")

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: defaultName ?? "" },
  })

  const { onChange: onAvatarChange, ...avatarField } = register("avatarFile")

  function onSubmit(values: ProfileFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", values.full_name)

      const file = values.avatarFile?.[0]
      if (file) formData.set("avatar", file)

      await saveProfile(formData)

      onDone()
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
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  {...avatarField}
                  onChange={(e) => {
                    onAvatarChange(e)
                    const file = e.target.files?.[0]
                    if (file) setPreview(URL.createObjectURL(file))
                  }}
                />
              </label>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="full_name">{t("full_name")}</FieldLabel>
            <Input
              id="full_name"
              placeholder="John Doe"
              aria-invalid={!!errors.full_name}
              {...register("full_name")}
            />
            {errors.full_name && (
              <FieldError>{errors.full_name.message}</FieldError>
            )}
          </Field>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? t("saving") : t("continue")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
