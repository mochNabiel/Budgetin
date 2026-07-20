"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { cn } from "@/shared/utils"
import { IWallet } from "@/types/wallet"
import { ICategory } from "@/features/category/lib/queries/get-categories"

interface Props {
  wallets: IWallet[]
  categories: ICategory[]
  currentFilters: {
    from?: string
    to?: string
    type?: "income" | "expense"
    wallet?: string
    category?: string
  }
}

export default function TransactionFilterDialog({
  wallets,
  categories,
  currentFilters,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("transaction.filter")

  const [open, setOpen] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: currentFilters.from ? new Date(currentFilters.from) : undefined,
    to: currentFilters.to ? new Date(currentFilters.to) : undefined,
  })
  const [type, setType] = useState<"all" | "income" | "expense">(
    currentFilters.type ?? "all"
  )
  const [walletId, setWalletId] = useState(currentFilters.wallet ?? "all")
  const [categoryId, setCategoryId] = useState(currentFilters.category ?? "all")

  const filteredCategories =
    type === "all" ? categories : categories.filter((c) => c.type === type)

  const activeFilterCount = [
    currentFilters.from,
    currentFilters.type,
    currentFilters.wallet,
    currentFilters.category,
  ].filter(Boolean).length

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString())

    if (dateRange?.from) {
      params.set("from", dateRange.from.toISOString().split("T")[0])
    } else {
      params.delete("from")
    }

    if (dateRange?.to) {
      params.set("to", dateRange.to.toISOString().split("T")[0])
    } else {
      params.delete("to")
    }

    if (type !== "all") {
      params.set("type", type)
    } else {
      params.delete("type")
    }

    if (walletId !== "all") {
      params.set("wallet", walletId)
    } else {
      params.delete("wallet")
    }

    if (categoryId !== "all") {
      params.set("category", categoryId)
    } else {
      params.delete("category")
    }

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  function handleReset() {
    setDateRange(undefined)
    setType("all")
    setWalletId("all")
    setCategoryId("all")
    router.push(pathname)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="relative">
          <SlidersHorizontal className="size-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Type */}
          <div className="flex flex-col gap-2">
            <Label>{t("type")}</Label>
            <div className="flex gap-2">
              {(["all", "expense", "income"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  className={cn(
                    "flex-1 rounded-xl border py-2 text-sm capitalize transition-colors",
                    type === option
                      ? option === "income"
                        ? "border-chart-2 bg-chart-2/10 text-chart-2"
                        : option === "expense"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-foreground bg-foreground/10 text-foreground"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {t(`type_${option}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="flex flex-col gap-2">
            <Label>{t("date_range")}</Label>
            <div className="flex justify-center rounded-xl border p-2">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                disabled={{ after: new Date() }}
                numberOfMonths={1}
              />
            </div>
          </div>

          {/* Wallet */}
          <div className="flex flex-col gap-2">
            <Label>{t("wallet")}</Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger className="w-full rounded-xl py-6">
                <SelectValue placeholder={t("wallet_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("wallet_placeholder")}</SelectItem>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex size-6 items-center justify-center rounded-full text-sm"
                        style={{ backgroundColor: wallet.color }}
                      >
                        {wallet.icon}
                      </span>
                      <span>{wallet.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <Label>{t("category")}</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full rounded-xl py-6">
                <SelectValue placeholder={t("category_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("category_placeholder")}</SelectItem>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex size-6 items-center justify-center rounded-full text-sm"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            {t("reset")}
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            {t("apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
