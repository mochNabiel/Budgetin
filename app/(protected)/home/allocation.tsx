"use client"

import { useMemo, useState } from "react"
import { Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { spendingCategories } from "@/lib/data"
import { Wallet } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const chartConfig = spendingCategories.reduce(
  (acc, item) => ({
    ...acc,
    [item.name]: {
      label: item.name,
      color: item.fill,
    },
  }),
  {}
)

export default function Allocation() {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income")

  const filteredData = useMemo(() => {
    return spendingCategories.filter((item) => item.type === activeTab)
  }, [activeTab])

  const total = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      return acc + Number(item.amount.replace(/[$,]/g, ""))
    }, 0)
  }, [filteredData])

  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 lg:size-5" />
          <CardTitle className="text-sm leading-none font-semibold lg:text-base">
            Alokasi
          </CardTitle>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "expense" | "income")}
        >
          <TabsList className="h-9 rounded-full bg-muted p-1">
            <TabsTrigger value="income" className="rounded-full px-4 text-xs">
              Income
            </TabsTrigger>
            <TabsTrigger value="expense" className="rounded-full px-4 text-xs">
              Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <div className="flex flex-1 flex-col items-center gap-4 lg:flex-row">
          <div className="h-52 w-52 shrink-0">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-full w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Pie
                  data={filteredData}
                  dataKey="percent"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={92}
                  strokeWidth={2}
                  stroke="var(--background)"
                />
              </PieChart>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="w-full flex-1 space-y-2.5">
            {filteredData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: cat.fill,
                    }}
                  />

                  <span className="text-xs text-muted-foreground">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground">
                    {cat.amount}
                  </span>

                  <span className="w-7 text-right text-xs text-muted-foreground">
                    {cat.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Total Allocation */}
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Total {activeTab === "expense" ? "Expenses" : "Income"}
            </p>

            <p className="text-base font-bold text-foreground">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="text-right">
            <p
              className={`text-sm font-semibold ${
                activeTab === "expense" ? "text-primary" : "text-chart-2"
              }`}
            >
              {activeTab === "expense" ? "-8.1%" : "+12.4%"}
            </p>

            <p className="text-xs text-muted-foreground">dari bulan lalu</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
