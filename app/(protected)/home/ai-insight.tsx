"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Send,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Flame,
  PiggyBank,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type InsightSeverity = "positive" | "warning" | "danger" | "tip"

interface InsightItem {
  id: string
  severity: InsightSeverity
  icon: React.ElementType
  title: string
  description: string
  metric?: string
  metricLabel?: string
  action?: string
}

// ─── Static mock — in production, replace with API response ───────────────────

const insights: InsightItem[] = [
  {
    id: "overspend-food",
    severity: "danger",
    icon: Flame,
    title: "Pengeluaran Makan Melonjak",
    description:
      "Kamu menghabiskan Rp 785.000 untuk Food & Dining bulan ini — 34% dari total pengeluaran. Ini 18% lebih tinggi dibanding bulan lalu.",
    metric: "+18%",
    metricLabel: "vs bulan lalu",
    action: "Atur batas anggaran",
  },
  {
    id: "savings-up",
    severity: "positive",
    icon: PiggyBank,
    title: "Tabungan Naik Signifikan",
    description:
      "Luar biasa! Tabunganmu naik 22% bulan ini menjadi Rp 2.125.000. Pertahankan pola pengeluaran ini untuk mencapai goal lebih cepat.",
    metric: "+22%",
    metricLabel: "dari bulan lalu",
    action: "Lihat progres goal",
  },
  {
    id: "subscription-alert",
    severity: "warning",
    icon: AlertTriangle,
    title: "3 Langganan Aktif Terdeteksi",
    description:
      "Google Workspace, Netflix, dan ChatGPT Plus menyumbang Rp 90.000/bulan. Pertimbangkan untuk meninjau mana yang masih relevan.",
    metric: "Rp 90k",
    metricLabel: "per bulan",
    action: "Kelola langganan",
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const severityConfig: Record<
  InsightSeverity,
  { badge: string; border: string; bg: string; icon: string; dot: string }
> = {
  positive: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    border: "border-l-emerald-500",
    bg: "bg-emerald-50/50",
    icon: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  warning: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    border: "border-l-amber-500",
    bg: "bg-amber-50/50",
    icon: "text-amber-600",
    dot: "bg-amber-500",
  },
  danger: {
    badge: "bg-red-100 text-red-700 border-red-200",
    border: "border-l-red-500",
    bg: "bg-red-50/50",
    icon: "text-red-600",
    dot: "bg-red-500",
  },
  tip: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    border: "border-l-blue-500",
    bg: "bg-blue-50/50",
    icon: "text-blue-600",
    dot: "bg-blue-500",
  },
}

const severityLabel: Record<InsightSeverity, string> = {
  positive: "Positif",
  warning: "Perhatian",
  danger: "Kritis",
  tip: "Tips",
}

export default function AiInsight() {
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setRefreshKey((k) => k + 1)
    }, 1200)
  }

  return (
    <Card size="sm" className="gap-3 overflow-hidden border-border py-4 shadow-sm">
      {/* ── Header ── */}
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 lg:size-5 animate-pulse text-primary" />
          <CardTitle className="text-sm lg:text-base leading-none font-semibold">
            <span className="bg-linear-to-br from-primary to-chart-2 bg-clip-text text-transparent">
              Insight Cerdas
            </span>
          </CardTitle>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="hover:text-foregroun shrink-0 text-muted-foreground"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw
            className={cn("size-4 text-primary", loading && "animate-spin")}
          />
        </Button>
      </CardHeader>

      {/* ── Insight list ── */}
      <CardContent className="space-y-3" key={refreshKey}>
        {insights.map((item) => {
          const cfg = severityConfig[item.severity]
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={cn(
                "group rounded-xl border-l-[3px] p-3 transition-all",
                cfg.border,
                cfg.bg,
                "cursor-default border border-border/60 hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-2.5">
                {/* Icon */}
                <div className="mt-0.5 shrink-0">
                  <Icon className={cn("size-4", cfg.icon)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs leading-tight font-semibold text-foreground">
                      {item.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-4 shrink-0 border px-1.5 py-0 text-[10px] font-medium",
                        cfg.badge
                      )}
                    >
                      {severityLabel[item.severity]}
                    </Badge>
                  </div>

                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>

      {/* ── Footer ── */}
      <CardFooter>
        <Button
          className="w-full gap-2 bg-linear-to-r from-primary to-chart-2 py-4.5 text-xs text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          size="sm"
        >
          <Lightbulb className="size-3.5" />
          Chat dengan Asisten AI
          <Send className="ml-auto size-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
