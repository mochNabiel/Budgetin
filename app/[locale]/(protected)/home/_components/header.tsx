import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Link from "next/link"
import { HeaderClient } from "@/app/[locale]/(protected)/home/_components/header-client"
import { getUserData } from "@/features/auth/lib/queries/get-user-data"
import { getTranslations } from "next-intl/server"
import ThemeToggle from "@/components/theme-toggle"
import LocaleToggle from "@/components/locale-toggle"
import { getCurrentDate } from "@/shared/helper/get-current-date"

export async function Header() {
  const user = await getUserData()
  const t = await getTranslations("home")

  return (
    <HeaderClient>
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-8 lg:size-9">
            <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium text-foreground lg:text-base">
              {t("welcome")} {user?.full_name.split(" ")[0]}
            </h1>

            <p className="text-xs text-muted-foreground">
              {getCurrentDate()}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <LocaleToggle />

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
