import {
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* BALANCE */}
      <Card size="sm" className="bg-linear-to-br from-primary via-primary to-primary/60 text-primary-foreground">
        <CardContent>
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground">
              Total Saldo
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

            <span className="text-primary-foreground/70">dari bulan lalu</span>
          </div>
        </CardContent>
      </Card>

      {/* INCOME + EXPENSE */}
      <div className="grid grid-cols-2 gap-4">
        {/* INCOME */}
        <Card size="sm" className="bg-foreground shadow-sm">
          <CardContent>
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

              <span className="text-muted-foreground">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* EXPENSE */}
        <Card size="sm" className="bg-foreground shadow-sm">
          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl sm:size-10",
                  "bg-primary text-foreground",
                  "dark:bg-primary dark:text-foreground"
                )}
              >
                <ArrowDownLeft className="size-4 sm:size-5" />
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

              <span className="text-muted-foreground">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
