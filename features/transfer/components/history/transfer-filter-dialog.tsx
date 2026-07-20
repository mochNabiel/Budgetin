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
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/navigation"

interface Props {
  currentFilters: {
    from?: string
    to?: string
  }
}

export default function TransferFilterDialog({ currentFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("transfer")
  const [open, setOpen] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: currentFilters.from ? new Date(currentFilters.from) : undefined,
    to: currentFilters.to ? new Date(currentFilters.to) : undefined,
  })

  const activeFilterCount = [currentFilters.from, currentFilters.to].filter(
    Boolean
  ).length

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString())

    if (dateRange?.from) params.set("from", dateRange.from.toISOString().split("T")[0])
    else params.delete("from")

    if (dateRange?.to) params.set("to", dateRange.to.toISOString().split("T")[0])
    else params.delete("to")

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  function handleReset() {
    setDateRange(undefined)
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
          <DialogTitle>{t("filter.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>{t("filter.date_range")}</Label>
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
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            {t("filter.reset")}
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            {t("filter.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
