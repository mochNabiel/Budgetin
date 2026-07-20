"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"

import { cn } from "@/shared/utils"
import { useTranslations } from "next-intl"

type CategoryFilter = "all" | "income" | "expense"

interface Props {
  currentFilter: CategoryFilter
}

export default function CategoryFilterTabs({ currentFilter }: Props) {
  const t = useTranslations("category")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(filter: CategoryFilter) {
    const params = new URLSearchParams(searchParams.toString())

    if (filter === "all") {
      params.delete("type")
    } else {
      params.set("type", filter)
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname

    router.push(nextUrl)
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {(["all", "income", "expense"] as const).map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => handleChange(filter)}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors",
            currentFilter === filter
              ? filter === "income"
                ? "border-chart-2 bg-chart-2/10 text-chart-2"
                : filter === "expense"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-foreground bg-foreground/10 text-foreground"
              : "border-border text-muted-foreground"
          )}
        >
          {filter === "all" ? "All" : t(filter)}
        </button>
      ))}
    </div>
  )
}
