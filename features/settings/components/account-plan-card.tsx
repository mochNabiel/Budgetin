"use client"

import Image from "next/image"
import { useMemo, useState, useTransition } from "react"
import { ChevronRight, Crown, Pencil } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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

export default function AccountPlanCard() {
  const user = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(user.avatar_url ?? null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [fullName, setFullName] = useState(user.full_name ?? "")
  const [error, setError] = useState<string | null>(null)

  const initials = useMemo(() => {
    const parts = (user.full_name || user.email).split(" ")
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
  }, [user.email, user.full_name])

  function handleFileChange(file: File | null) {
    setAvatarFile(file)
    setError(null)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", fullName)
      if (avatarFile) {
        formData.set("avatar", avatarFile)
      }

      const result = await saveProfile(formData)
      if (!result.success) {
        setError(result.message ?? "Failed to save profile")
        return
      }

      toast.success(result.message ?? "Profile saved")
      setOpen(false)
      router.refresh()
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

            <Dialog open={open} onOpenChange={setOpen}>
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel>Avatar</FieldLabel>
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
                              No avatar
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Change avatar</p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, or WEBP
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleFileChange(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                      <Input
                        id="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>

                  {error && <FieldError>{error}</FieldError>}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full"
                  >
                    {isPending ? <Spinner /> : "Save changes"}
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
          Current Plan
        </p>
        <h3 className="mt-1 text-2xl font-semibold capitalize">{plan}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan === "pro"
            ? "You are using the full version."
            : "Upgrade to unlock the full version."}
        </p>
      </div>

      <div className="p-4 pt-0">
        <Button
          className="rounded-xl h-12 w-full gap-2 bg-linear-to-r from-primary via-primary to-chart-2 text-primary-foreground hover:opacity-95"
          onClick={() => router.push("/subscription")}
        >
          <Crown className="size-4" />
          Upgrade to Pro
          <ChevronRight className="ml-auto size-4" />
        </Button>
      </div>
    </div>
  )
}
