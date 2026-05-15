import { CalendarDays, Plus, ChevronDown } from "lucide-react"
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
    <header className="sticky top-0 z-10 w-full bg-background py-2">
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={user?.avatar_url}
            alt="Profile"
            width={40}
            height={40}
            className="size-9 rounded-full md:size-10"
          />

          <div className="min-w-0">
            <h1 className="truncate text-base font-medium text-foreground md:text-lg">
              Morning, {user?.full_name} ⛅️
            </h1>

            <p className="hidden text-sm text-muted-foreground sm:block">
              Here&apos;s your financial overview today.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2">
          {/* DATE */}
          <MonthPicker />

          {/* DESKTOP ONLY */}
          <Link href="/transaction">
            <Button className="hidden md:flex">
              <Plus className="size-4" />
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
