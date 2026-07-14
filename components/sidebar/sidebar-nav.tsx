"use client"

import { useTranslations } from "next-intl"

import { SidebarMenu } from "@/components/ui/sidebar"
import { sidebarItems } from "@/constants/sidebar"
import { SidebarItem } from "./sidebar-item"

export function SidebarNav() {
  const t = useTranslations("sidebar")

  return (
    <SidebarMenu className="gap-1">
      {sidebarItems.map((item) => (
        <SidebarItem
          key={item.key}
          href={item.href}
          icon={item.icon}
          title={t(item.key)}
        />
      ))}
    </SidebarMenu>
  )
}
