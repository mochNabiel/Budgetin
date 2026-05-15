"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { Home, Sparkles, LayoutGrid, UserRound } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Assistant",
    url: "/assistant",
    icon: Sparkles,
  },
  {
    title: "Preferences",
    url: "/preferences",
    icon: LayoutGrid,
  },
  {
    title: "Account",
    url: "/account",
    icon: UserRound,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      {/* HEADER */}
      <SidebarHeader className="p-2">
        <div className="flex items-center gap-2">
          {/* LOGO */}
          {state !== "collapsed" && (
            <Link
              href="/home"
              className="flex h-11 min-w-0 flex-1 items-center gap-1 overflow-hidden rounded-xl px-2"
            >
              <div className="flex size-7 shrink-0 items-center justify-center">
                <Image
                  src="/assets/icons/logo.svg"
                  alt="Budgetin Logo"
                  width={20}
                  height={20}
                  className="size-5"
                />
              </div>

              <span className="truncate font-heading text-lg font-semibold text-primary">
                Budgetin
              </span>
            </Link>
          )}

          {/* TRIGGER */}
          <SidebarTrigger className="flex size-8 items-center justify-center [&>svg]:size-5"></SidebarTrigger>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(`${item.url}/`)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary"
                >
                  <Link href={item.url}>
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
