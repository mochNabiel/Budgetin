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
    <div className="flex flex-col lg:flex-row gap-4 mt-1">
      {/* BALANCE */}
      <Card size="sm" className="bg-linear-to-br from-primary via-primary to-primary/60 text-primary-foreground w-full lg:w-1/3">
        <CardContent>
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground">
              Total Saldo
            </span>

            <button className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
              <Eye className="size-4" />
            </button>
          </div>

          <div className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
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
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* INCOME */}
        <Card size="sm">
          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center rounded-xl size-10",
                  "bg-chart-2 text-background"
                )}
              >
                <ArrowUpRight className="size-5" />
              </div>

              <span className="text-base font-medium tracking-wide text-chart-2">
                Income
              </span>
            </div>

            <div className="mb-2 font-bold tracking-tight text-foreground text-xl lg:text-3xl">
              Rp 8.250.000
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[11px] text-xs lg:text-sm">
              <span className="font-semibold text-chart-2 dark:text-chart-2">
                +12.5%
              </span>

              <span className="text-muted-foreground">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* EXPENSE */}
        <Card size="sm">
          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center rounded-xl size-10",
                  "bg-primary text-background",
                )}
              >
                <ArrowDownLeft className="size-5" />
              </div>

              <span className="text-base font-medium tracking-wide text-primary">
                Expenses
              </span>
            </div>

            <div className="mb-2 font-bold tracking-tight text-foreground text-xl lg:text-3xl">
              Rp 2.250.000
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[11px] text-xs lg:text-sm">
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
