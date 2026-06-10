import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { MonthPicker } from "@/app/[locale]/(protected)/home/_components/month-picker"
import Link from "next/link"
import { HeaderClient } from "@/app/[locale]/(protected)/home/_components/header-client"
import { getUserData } from "@/lib/queries/get-user-data"

export async function Header() {
  const user = await getUserData()

  return (
    <HeaderClient>
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-8 lg:size-9">
            <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
            <AvatarFallback>
              {user?.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium text-foreground lg:text-base">
              Hai, {user?.full_name} 👋🏻
            </h1>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Saatnya lihat progress finansialmu hari ini.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2">
          {/* DATE */}
          <MonthPicker />

          {/* DESKTOP ONLY */}
          <Link href="/home?open-transaction=new">
            <Button className="hidden lg:flex">
              <Plus className="size-4" />
              Buat Transaksi
            </Button>
          </Link>
        </div>
      </div>
    </HeaderClient>
  )
}
