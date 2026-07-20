"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
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
import { Spinner } from "@/components/ui/spinner"
import { deleteTransfer } from "@/features/transfer/lib/actions/delete-transfer"
import { useRouter } from "@/i18n/navigation"

interface Props {
  transferId: string
}

export default function DeleteTransferButton({ transferId }: Props) {
  const t = useTranslations("transfer")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTransfer(transferId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.push("/transfer")
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-12 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
          {t("delete_btn")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete_alert_title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("delete_alert_msg")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Spinner /> : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
