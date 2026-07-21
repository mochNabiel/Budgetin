import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { HeaderClient } from "@/features/home/components/header-client"
import { getTranslations } from "next-intl/server"
import ThemeToggle from "@/components/global/theme-toggle"
import LocaleToggle from "@/components/global/locale-toggle"
import { getUserData } from "@/features/auth/lib/queries"
import { User } from "lucide-react"

export async function Header() {
  const [user, t] = await Promise.all([getUserData(), getTranslations("home.header")])

  return (
    <HeaderClient>
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="text-xs text-muted-foreground">{t("welcome")}</h1>

            <p className="line-clamp-1">{user?.full_name}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <LocaleToggle />
        </div>
      </div>
    </HeaderClient>
  )
}
