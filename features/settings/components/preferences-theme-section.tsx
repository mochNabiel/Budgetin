"use client"

import { MoonStar, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { THEME_OPTIONS } from "@/constants/theme"
import { cn } from "@/shared/utils"

export default function PreferencesThemeSection() {
  const t = useTranslations("settings.preferences")
  const tTheme = useTranslations("theme")
  const { theme, setTheme } = useTheme()

  const currentTheme = theme ?? "system"

  return (
    <div className="border-t px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
          <SunMedium className="size-5 dark:hidden" />
          <MoonStar className="hidden size-5 dark:block" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{t("theme")}</p>
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            {tTheme(currentTheme)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {THEME_OPTIONS.map(({ value, icon: Icon }) => {
          const selected = currentTheme === value

          return (
            <button
              key={value}
              type="button"
              aria-label={tTheme(value)}
              onClick={() => setTheme(value)}
              suppressHydrationWarning
              className={cn(
                "flex h-11 items-center justify-center rounded-xl border transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="size-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
