"use client"

import { useState, useTransition } from "react"
import { ChevronRight, LogOut, Trash2 } from "lucide-react"
import { toast } from "sonner"

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

export default function DangerZoneCard() {
  const [isPending, startTransition] = useTransition()
  const [deleteConfirm, setDeleteConfirm] = useState("")

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  function handleDeleteAccount() {
    startTransition(async () => {
      const result = await deleteAccount()

      if (!result?.success) {
        toast.error(result?.message ?? "Failed to delete account")
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
              <p className="font-medium">Logout</p>
              <p className="text-sm text-muted-foreground">
                Sign out from your account
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout from this device?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Logout
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
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and data
              </p>
            </div>
            <ChevronRight className="size-4 text-destructive" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your profile, wallets, categories,
              transactions, transfers, and other related data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Field>
            <FieldLabel className="text-sm">
              Type <span className="font-semibold">delete my account</span> to
              continue
            </FieldLabel>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="delete my account"
            />
          </Field>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isPending || deleteConfirm.trim() !== "delete my account"}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
