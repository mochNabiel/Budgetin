"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import WalletForm from "./wallet-form"
import { createWallet } from "../lib/actions/create-wallet"
import { useTranslations } from "next-intl"

export default function AddWalletDialog() {
  const t = useTranslations("wallet")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 h-12">
          <Plus className="size-4" />
          {t("add_wallet")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("add_wallet")}</DialogTitle>
        </DialogHeader>

        <WalletForm
          mode="create"
          onSubmitAction={createWallet}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
