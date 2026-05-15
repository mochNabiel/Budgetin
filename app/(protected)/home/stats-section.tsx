import {
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* BALANCE */}
      <Card className="border-0 bg-linear-to-br from-primary via-primary to-primary/60 text-primary-foreground shadow-md">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground/80">
              Total Balance
            </span>

            <button className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
              <Eye className="size-4" />
            </button>
          </div>

          <div className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Rp 12.450.000
          </div>

          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="size-3.5" />

            <span className="font-medium">+12.5%</span>

            <span className="text-primary-foreground/70">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* INCOME + EXPENSE */}
      <div className="grid grid-cols-2 gap-4">
        {/* INCOME */}
        <Card className="border-border bg-foreground shadow-sm">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl sm:size-10",
                  "bg-chart-2 text-foreground",
                  "dark:bg-chart-2 dark:text-foreground"
                )}
              >
                <ArrowUpRight className="size-4 sm:size-5" />
              </div>

              <span className="text-base font-medium tracking-wide text-chart-2">
                Income
              </span>
            </div>

            <div className="mb-2 text-lg font-bold tracking-tight text-background sm:text-2xl lg:text-3xl">
              Rp 8.250.000
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs lg:text-sm">
              <span className="font-semibold text-chart-2 dark:text-chart-2">
                +12.5%
              </span>

              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* EXPENSE */}
        <Card className="border-border bg-foreground shadow-sm">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl sm:size-10",
                  "bg-primary text-foreground",
                  "dark:bg-primary dark:text-foreground"
                )}
              >
                <ArrowDownRight className="size-4 sm:size-5" />
              </div>

              <span className="text-base font-medium tracking-wide text-primary">
                Expenses
              </span>
            </div>

            <div className="mb-2 text-lg font-bold tracking-tight text-background sm:text-2xl lg:text-3xl">
              Rp 2.250.000
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs lg:text-sm">
              <span className="font-semibold text-primary dark:text-primary">
                -8.1%
              </span>

              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
