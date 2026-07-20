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
import { deleteTransaction } from "@/features/transaction/lib/actions/delete-transaction"
import { useRouter } from "@/i18n/navigation"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"

interface Props {
  transactionId: string
}

export default function DeleteTransactionButton({ transactionId }: Props) {
  const t = useTranslations("transaction")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTransaction(transactionId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.push("/transaction")
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
          <AlertDialogDescription>
            {t("delete_alert_msg")}
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
