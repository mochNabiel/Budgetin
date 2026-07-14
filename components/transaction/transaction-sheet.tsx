"use client"

import { useRouter, usePathname } from "@/i18n/navigation"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useTransactionDialog } from "@/shared/hooks/use-transaction-dialog"
import { CreateTransactionForm } from "./create-transaction-form"
import { Separator } from "../ui/separator"

export function TransactionSheet() {
  const router = useRouter()
  const pathname = usePathname()

  const { isOpen, isCreate, transactionId } = useTransactionDialog()

  function handleClose(open: boolean) {
    if (!open) {
      router.replace(pathname)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        showCloseButton={false}
        side="bottom"
        className="mx-auto max-h-8/10 w-full max-w-2xl overflow-y-auto rounded-t-3xl"
      >
        <SheetHeader className="mx-auto p-4">
          <SheetTitle className="text-base font-semibold text-primary lg:text-lg">
            {isCreate ? "Tambah Transaksi" : "Edit Transaksi"}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {isCreate ? (
          <CreateTransactionForm />
        ) : (
          <CreateTransactionForm transactionId={transactionId!} />
        )}
      </SheetContent>
    </Sheet>
  )
}
