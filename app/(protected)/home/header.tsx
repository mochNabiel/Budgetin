import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { MonthPicker } from "@/components/home/month-picker"
import Link from "next/link"

export async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims.user_metadata

  return (
    <header className="sticky top-2 z-10 w-full rounded-xl bg-background/70 py-3 px-2 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={user?.avatar_url}
            alt="Profile"
            width={40}
            height={40}
            className="size-9 rounded-full lg:size-10"
          />

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
          <Link href="/transaction">
            <Button className="hidden lg:flex">
              <Plus className="size-4" />
              Buat Transaksi
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
