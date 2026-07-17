"use client"

import { useState } from "react"

import {
  Sparkles,
  ArrowUpRight,
  Lock,
  Crown,
  Bot,
  Mic,
  LayoutDashboard,
  ReceiptText,
  FileSpreadsheet,
  PieChart,
  Tags,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const freeFeatures = [
  {
    label: "Dashboard finansial interaktif",
    icon: LayoutDashboard,
  },
  {
    label: "Monthly financial overview",
    icon: PieChart,
  },
  {
    label: "Pencatatan transaksi",
    icon: ReceiptText,
  },
  {
    label: "Export PDF & Excel",
    icon: FileSpreadsheet,
  },
]

const proFeatures = [
  {
    label: "AI Financial Smart Insights",
    icon: Sparkles,
  },
  {
    label: "AI Chat Assistant",
    icon: Bot,
  },
  {
    label: "Input transaksi dengan Voice AI",
    icon: Mic,
  },
  {
    label: "Custom kategori transaksi",
    icon: Tags,
  },
]

export function PlanSection() {
  const [isPro, setIsPro] = useState(false)

  const allFeatures = [
    ...freeFeatures.map((feature) => ({
      ...feature,
      locked: false,
    })),
    ...proFeatures.map((feature) => ({
      ...feature,
      locked: !isPro,
    })),
  ]

  return (
    <Item
      size="sm"
      className="relative overflow-hidden border-border/50 bg-card/70 backdrop-blur-2xl"
    >
      {/* Gradient Glow */}
      <div
        className={`absolute inset-0 -z-10 bg-linear-to-br transition-all duration-500 ${
          isPro
            ? "from-primary/15 to-chart-2/15"
            : "from-primary/10 to-chart-2/10"
        } `}
      />

      <ItemContent className="gap-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <ItemMedia>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-linear-to-br from-primary to-chart-2 text-primary-foreground backdrop-blur-xl transition-all duration-300">
              {isPro ? (
                <Crown className="size-5" />
              ) : (
                <Sparkles className="size-5" />
              )}
            </div>
          </ItemMedia>

          <div>
            <ItemTitle className="gap-1 text-base font-semibold tracking-tight sm:text-lg">
              {isPro ? (
                <>
                  Anda menggunakan{" "}
                  <span className="text-primary">Pro Plan</span>
                </>
              ) : (
                <>
                  Anda berada di <span className="text-primary">Free Plan</span>
                </>
              )}
            </ItemTitle>

            <ItemDescription className="text-sm leading-relaxed">
              {isPro
                ? "Semua fitur premium telah terbuka untuk pengalaman finansial yang lebih cerdas dan personal."
                : "Tingkatkan pengalaman finansial Anda dengan fitur premium berbasis AI."}
            </ItemDescription>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-2 sm:grid-cols-2">
          {allFeatures.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.label}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 backdrop-blur-xl transition-all duration-300 ${
                  feature.locked
                    ? "border-border/40 bg-muted/30 opacity-70"
                    : "border-border/60 bg-background/50"
                } `}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    feature.locked
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  } `}
                >
                  {feature.locked ? (
                    <Lock className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>

                <span className="text-sm leading-snug font-medium">
                  {feature.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Button */}
        <div className="pt-1">
          {isPro ? (
            <Button disabled className="w-full sm:w-auto">
              <Check className="size-4" />
              <span>Pro Active</span>
            </Button>
          ) : (
            <Button onClick={() => setIsPro(true)} className="w-full sm:w-auto">
              <ArrowUpRight className="size-4" />
              Upgrade ke Pro
            </Button>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}
