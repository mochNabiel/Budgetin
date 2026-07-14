"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { ArrowUpRight, Crown } from "lucide-react"

import { SidebarFooter, useSidebar } from "@/components/ui/sidebar"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AppSidebarFooter() {
  const { state } = useSidebar()
  const t = useTranslations("sidebar")

  if (state === "collapsed") return null

  return (
    <SidebarFooter className="p-2">
      <Card className="flex flex-col gap-2 bg-linear-to-br from-primary/10 to-chart-2/10 p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-2xl bg-background shadow-sm">
            <Crown className="size-4 text-[#FFD700]" fill="#FFD700" />
          </div>

          <h3 className="text-base font-semibold text-primary">
            {t("pro_title")}
          </h3>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          {t("pro_description")}
        </p>

        <Link href="/plan">
          <Button className="w-full">
            <ArrowUpRight />
            {t("upgrade")}
          </Button>
        </Link>
      </Card>
    </SidebarFooter>
  )
}
