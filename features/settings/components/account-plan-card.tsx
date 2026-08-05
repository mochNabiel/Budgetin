"use client"

import Image from "next/image"
import { useMemo, useState, useTransition } from "react"
import { ChevronRight, Crown, Pencil } from "lucide-react"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/components/global/user-provider"
import { saveProfile } from "@/features/auth/lib/actions/save-profile"
import { useRouter } from "@/i18n/navigation"
import {
  ProfileFormValues,
  profileSchema,
} from "@/shared/schemas/profile.schema"
import { useTranslations } from "next-intl"
import { handleActionResult } from "@/shared/lib/handle-action-result"

export default function AccountPlanCard() {
  const t = useTranslations("settings.account_plan")
  const user = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(user.avatar_url ?? null)

  const initials = useMemo(() => {
    const parts = (user.full_name || user.email).split(" ")
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
  }, [user.email, user.full_name])

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      avatar: null,
    },
  })

  function handleDialogOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setPreview(user.avatar_url ?? null)
      reset({ full_name: user.full_name ?? "", avatar: null })
    }
  }

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", values.full_name)
      if (values.avatar) {
        formData.set("avatar", values.avatar)
      }

      const result = await saveProfile(formData)
      const handled = await handleActionResult(result, {
        errorMessage: t("errors.save_failed"),
        onError: (message) => {
          toast.error(message)
        },
        onSuccess: () => {
          toast.success(t("messages.saved"))
          setOpen(false)
          router.refresh()
        },
      })

      if (!handled.success) {
        return
      }
    })
  }

  const plan = user.plan ?? "free"

  return (
    <div className="overflow-hidden rounded-3xl border bg-background">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="relative size-20 overflow-hidden rounded-full bg-muted">
              {user.avatar_url ? (
                <Image
                  src={preview ?? user.avatar_url}
                  alt={user.full_name ?? user.email}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-lg font-semibold text-muted-foreground">
                  {initials || "U"}
                </div>
              )}
            </div>

            <Dialog open={open} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  className="absolute right-0 bottom-0 size-8 rounded-full bg-primary text-primary-foreground shadow-lg"
                >
                  <Pencil className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("edit_dialog_title")}</DialogTitle>
                  <DialogDescription>
                    {t("edit_dialog_description")}
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                  noValidate
                >
                  <FieldGroup className="gap-4">
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>{t("avatar_title")}</FieldLabel>
                          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-3">
                            <div className="relative size-14 overflow-hidden rounded-full bg-muted">
                              {preview ? (
                                <Image
                                  src={preview}
                                  alt="Avatar preview"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                  {t("avatar_empty")}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">
                                {t("avatar_change")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("avatar_description")}
                              </p>
                            </div>
                            <Input
                              ref={field.ref}
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null
                                field.onChange(file)
                                if (file) {
                                  setPreview(URL.createObjectURL(file))
                                }
                              }}
                            />
                          </label>
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
                          <FieldLabel htmlFor="full_name">{t("name_title")}</FieldLabel>
                          <Input
                            id="full_name"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full"
                  >
                    {isPending ? <Spinner /> : t("edit_dialog_save")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold">
              {user.full_name || "Your name"}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="p-4">
        <p className="text-sm font-medium text-muted-foreground">
          {t("plan")}
        </p>
        <h3 className="mt-1 text-2xl font-semibold capitalize">{plan}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan === "pro"
            ? t("plan_pro_description")
            : t("plan_free_description")}
        </p>
      </div>

      <div className="p-4 pt-0">
        <Button
          className="h-12 w-full gap-2 rounded-xl bg-linear-to-r from-primary via-primary to-chart-2 text-primary-foreground hover:opacity-95"
          onClick={() => router.push("/subscription")}
        >
          <Crown className="size-4" />
          {t("upgrade")}
          <ChevronRight className="ml-auto size-4" />
        </Button>
      </div>
    </div>
  )
}
