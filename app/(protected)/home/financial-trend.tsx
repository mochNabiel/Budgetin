"use client"

import { useMemo, useState } from "react"
import { BarChartBig } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { spendingTrendData } from "@/lib/data"

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expense",
    color: "var(--primary)",
  },
}

export default function FinancialTrend() {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all"
  )

  const visibleBars = useMemo(() => {
    switch (activeTab) {
      case "income":
        return ["income"]

      case "expense":
        return ["expense"]

      default:
        return ["income", "expense"]
    }
  }, [activeTab])

  return (
    <Card size="sm" className="space-y-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChartBig className="size-4 lg:size-5" />
          <CardTitle className="text-sm leading-none font-semibold lg:text-base">
            Tren Keuangan
          </CardTitle>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "income" | "expense")}
        >
          <TabsList>
            <TabsTrigger
              value="all"
              className="rounded-full px-2 text-xs lg:px-4"
            >
              Semua
            </TabsTrigger>

            <TabsTrigger
              value="income"
              className="rounded-full px-2 text-xs lg:px-4"
            >
              Income
            </TabsTrigger>

            <TabsTrigger
              value="expense"
              className="rounded-full px-2 text-xs lg:px-4"
            >
              Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            data={spendingTrendData}
            margin={{
              top: 10,
              right: 0,
              left: -20,
              bottom: 0,
            }}
            barGap={8}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `$${value}`}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `$${value}`,
                    chartConfig[name as keyof typeof chartConfig]?.label,
                  ]}
                />
              }
            />

            {visibleBars.includes("income") && (
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[6, 6, 0, 0]}
              />
            )}

            {visibleBars.includes("expense") && (
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                radius={[6, 6, 0, 0]}
              />
            )}
          </BarChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />

            <span className="text-xs text-muted-foreground">Expense</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />

            <span className="text-xs text-muted-foreground">Income</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
