import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MonthPicker } from "@/components/home/month-picker"
import Link from "next/link"
import { HeaderClient } from "@/components/home/header-client"
import { getUserData } from "@/lib/queries/get-user-data"

export async function Header() {
  const user = await getUserData()
  const { name, avatar_url } = user?.user_metadata

  return (
    <HeaderClient>
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={avatar_url}
            alt="Profile"
            width={40}
            height={40}
            className="size-9 rounded-full lg:size-10"
          />

          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium text-foreground lg:text-base">
              Hai, {name} 👋🏻
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
          <Link href="/transaction">
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
