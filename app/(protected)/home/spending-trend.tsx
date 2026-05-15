"use client"

import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

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

export function SpendingTrend() {
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
    <Card className="border-border shadow-sm gap-2 py-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Spending Trend
        </CardTitle>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs text-muted-foreground"
        >
          This Month <ChevronDown className="h-3 w-3" />
        </Button>
      </CardHeader>

      <CardContent>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "income" | "expense")}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="all" className="rounded-full px-4 text-xs">
              All
            </TabsTrigger>

            <TabsTrigger value="income" className="rounded-full px-4 text-xs">
              Income
            </TabsTrigger>

            <TabsTrigger value="expense" className="rounded-full px-4 text-xs">
              Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="w-full h-52">
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
        <div className="mt-4 flex items-center gap-5">
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
