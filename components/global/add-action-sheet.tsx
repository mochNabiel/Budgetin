"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeftRight, WalletMinimal } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "@/i18n/navigation"

interface Props {
  walletCount: number
  children: React.ReactNode
}

export default function AddActionSheet({ walletCount, children }: Props) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("home.add_action_sheet")

  const canTransfer = walletCount > 1

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-3xl w-full max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 p-4 pt-0 pb-8">
          <Link
            href="/transaction/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-muted/50"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <WalletMinimal className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{t("record_title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("record_description")}
              </p>
            </div>
          </Link>

          {canTransfer ? (
            <Link
              href="/transfer/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-chart-2/10 text-chart-2">
                <ArrowLeftRight className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t("transfer_title")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("transfer_description")}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex cursor-not-allowed items-center gap-4 rounded-2xl border border-dashed p-4 opacity-60">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ArrowLeftRight className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t("transfer_title")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("transfer_disabled_description")}
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
