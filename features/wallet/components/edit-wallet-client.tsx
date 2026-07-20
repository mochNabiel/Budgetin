"use client"

import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useTransition } from "react"

import WalletForm from "./wallet-form"
import { updateWallet } from "../lib/actions/update-wallet"
import { deleteWallet } from "../lib/actions/delete-wallet"
import { useRouter } from "@/i18n/navigation"
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
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { IWalletDetail } from "../lib/queries/get-wallet-detail"
import { useTranslations } from "next-intl"

interface Props {
  wallet: IWalletDetail
}

export default function EditWalletClient({ wallet }: Props) {
  const t = useTranslations("wallet")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteWallet(wallet.id)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.push("/home")
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <WalletForm
        mode="edit"
        defaultValues={{
          name: wallet.name,
          icon: wallet.icon,
          color: wallet.color,
          balance: wallet.balance,
        }}
        onSubmitAction={(formData) => updateWallet(wallet.id, formData)}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="h-12 w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
            {t("delete_wallet")}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("delete")} &quot;{wallet.name}&quot;?
            </AlertDialogTitle>
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
    </div>
  )
}
