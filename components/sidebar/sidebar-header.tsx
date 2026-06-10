"use client"

import { Link } from "@/i18n/navigation"
import Image from "next/image"

import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebarHeader() {
  const { state } = useSidebar()

  return (
    <SidebarHeader className="p-2">
      <div className="flex items-center gap-2">
        {state !== "collapsed" && (
          <Link
            href="/home"
            className="flex h-11 min-w-0 flex-1 items-center gap-1 overflow-hidden rounded-xl px-2"
          >
            <div className="flex size-7 items-center justify-center">
              <Image
                src="/icons/logo.svg"
                alt="Budgetin Logo"
                width={16}
                height={16}
              />
            </div>

            <span className="font-heading text-lg font-semibold text-primary">
              Budgetin
            </span>
          </Link>
        )}

        <SidebarTrigger className="flex size-8 items-center justify-center" />
      </div>
    </SidebarHeader>
  )
}
