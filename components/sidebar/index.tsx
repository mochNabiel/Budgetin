"use client"

import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

import { AppSidebarHeader } from "./sidebar-header"
import { AppSidebarFooter } from "./sidebar-footer"
import { SidebarNav } from "./sidebar-nav"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <AppSidebarHeader />

      <SidebarContent className="px-2">
        <SidebarNav />
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  )
}
