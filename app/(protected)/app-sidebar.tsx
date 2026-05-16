"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { Home, Sparkles, LayoutGrid, UserRound, Crown, Wallet } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "Beranda",
    url: "/home",
    icon: Home,
  },
  {
    title: "Transaksi",
    url: "/transaction",
    icon: Wallet,
  },
  {
    title: "Asisten AI",
    url: "/assistant",
    icon: Sparkles,
  },
  {
    title: "Personalisasi",
    url: "/preferences",
    icon: LayoutGrid,
  },
  {
    title: "Pengaturan Akun",
    url: "/account",
    icon: UserRound,
  },
  {
    title: "Langganan",
    url: "/plan",
    icon: Crown,
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
      <SidebarFooter className="p-2">
        {state !== "collapsed" && (
          <Card className="via-primary-10 flex flex-col gap-2 bg-linear-to-br from-primary/10 to-chart-2/10 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-2xl bg-background shadow-sm">
                <Crown className="size-4 text-[#FFD700]" fill="#FFD700" />
              </div>
              <h3 className="text-base font-semibold text-primary">
                Budgetin Pro
              </h3>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Dapatkan fitur lengkap: smart insight AI, input suara, asisten AI dan lebih banyak lagi.
            </p>

            <Link href="/plan" className="w-full">
              <Button className="w-full">Upgrade ke Pro</Button>
            </Link>
          </Card>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
