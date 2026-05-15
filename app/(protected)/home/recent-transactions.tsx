"use client"

import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, ChevronRight, History } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { transactionsItem } from "@/lib/data"
import { cn } from "@/lib/utils"
import formatCurrency from "@/lib/helper/format-currency"

export default function RecentTransactions() {
  return (
    <Card size="sm" className="gap-2 py-4">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="size-4 lg:size-5" />
          <CardTitle className="text-sm leading-none font-semibold lg:text-base">
            Transaksi Terbaru
          </CardTitle>
        </div>

        <Link href="/transaction">
          <Button variant="link" size="sm" className="gap-1 px-0 text-xs">
            Lihat Semua
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-0">
        <div className="flex flex-col">
          {transactionsItem.map((transaction) => {
            const isIncome = transaction.amount > 0

            return (
              <div
                key={transaction.id}
                className="flex items-start justify-between gap-3 border-none py-4 transition-colors hover:bg-muted/40"
              >
                {/* LEFT */}
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-2xl border",
                      isIncome
                        ? "border-chart-2/10 bg-chart-2/10"
                        : "border-primary/10 bg-primary/10"
                    )}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="size-5 text-chart-2" />
                    ) : (
                      <ArrowDownLeft className="size-5 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {transaction.name}
                    </p>

                    <Badge className="mt-1 rounded-full px-2 py-0 text-[10px]">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isIncome ? "text-chart-2" : "text-primary"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
