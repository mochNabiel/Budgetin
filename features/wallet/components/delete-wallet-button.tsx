"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
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
import { deleteWallet } from "../lib/actions/delete-wallet"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"

interface Props {
  walletId: string
  walletName: string
}

export default function DeleteWalletButton({ walletId, walletName }: Props) {
  const t = useTranslations("wallet")
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteWallet(walletId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete")} &quot;{walletName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete_dialog_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
          >
            {isPending ? <Spinner /> : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
