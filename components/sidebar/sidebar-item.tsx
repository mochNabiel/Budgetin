"use client"

import { usePathname, Link } from "@/i18n/navigation"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

interface SidebarItemProps {
  href: string
  title: string
  icon: React.ElementType
}

export function SidebarItem({ href, title, icon: Icon }: SidebarItemProps) {
  const pathname = usePathname()

  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={title}
        isActive={isActive}
        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary"
      >
        <Link href={href}>
          <Icon className="size-5" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
