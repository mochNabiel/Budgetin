"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import WalletForm from "./wallet-form"
import { updateWallet } from "../lib/actions/update-wallet"
import { IWallet } from "@/types/wallet"

interface Props {
  wallet: IWallet
}

export default function EditWalletDialog({ wallet }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Wallet</DialogTitle>
        </DialogHeader>

        <WalletForm
          mode="edit"
          defaultValues={{
            name: wallet.name,
            icon: wallet.icon,
            color: wallet.color,
            balance: wallet.balance,
          }}
          onSubmitAction={(formData) => updateWallet(wallet.id, formData)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
