"use client"

import { useState, useTransition } from "react"
import { ChevronRight, LogOut, Trash2 } from "lucide-react"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { logout } from "@/features/auth/lib/actions/logout"
import { deleteAccount } from "@/features/auth/lib/actions/delete-account"
import { handleActionResult } from "@/shared/lib/handle-action-result"
import { Kbd } from "@/components/ui/kbd"

export default function DangerZoneCard() {
  const t = useTranslations("settings.danger_zone")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteConfirm, setDeleteConfirm] = useState("")

  function handleLogout() {
    startTransition(async () => {
      const result = await logout()
      const handled = await handleActionResult(result, {
        errorMessage: t("errors.logout_failed"),
        onError: (message) => {
          toast.error(message)
        },
        onSuccess: () => router.refresh(),
      })

      if (!handled.success) {
        return
      }
    })
  }

  function handleDeleteAccount() {
    startTransition(async () => {
      const result = await deleteAccount()
      const handled = await handleActionResult(result, {
        errorMessage: t("errors.delete_failed"),
        onError: (message) => {
          toast.error(message)
        },
        onSuccess: () => {
          toast.success(t("messages.deleted"))
        },
      })

      if (!handled.success) {
        return
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-background">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/40"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
              <LogOut className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{t("logout_title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("logout_description")}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("logout_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("logout_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("logout_action")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 border-t px-4 py-4 text-left transition-colors hover:bg-destructive/5"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-destructive">
                {t("delete_title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("delete_description")}
              </p>
            </div>
            <ChevronRight className="size-4 text-destructive" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Field>
            <FieldLabel className="text-sm">
              {t.rich("delete_instruction", {
                phrase: "delete my account",
                kbd: (chunks) => <Kbd>{chunks}</Kbd>,
              })}
            </FieldLabel>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="delete my account"
            />
          </Field>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={
                isPending || deleteConfirm.trim() !== "delete my account"
              }
              onClick={handleDeleteAccount}
            >
              {t("delete_action")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
