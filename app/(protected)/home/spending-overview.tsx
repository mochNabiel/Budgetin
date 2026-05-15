"use client"

import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { spendingCategories } from "@/lib/data"

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

export function SpendingOverview() {
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
    <Card className="border-border shadow-sm gap-2 py-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Spending Overview
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
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "expense" | "income")}
          className="mb-5"
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

        <div className="flex-1 flex items-center gap-4">
          <div className="h-40 w-40 shrink-0">
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
                  innerRadius={45}
                  outerRadius={68}
                  strokeWidth={2}
                  stroke="var(--background)"
                />
              </PieChart>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5">
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

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
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
                activeTab === "expense"
                  ? "text-primary"
                  : "text-chart-2"
              }`}
            >
              {activeTab === "expense" ? "-8.1%" : "+12.4%"}
            </p>

            <p className="text-xs text-muted-foreground">from last month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
