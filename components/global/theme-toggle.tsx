"use client"

import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { THEME_OPTIONS } from "@/constants/theme"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MoonStar, SunMedium } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("theme")

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t("toggle")}>
              <SunMedium className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <MoonStar className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">{t("toggle")}</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("change")}</TooltipContent>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={theme ?? "system"}
            onValueChange={(nextTheme) => setTheme(nextTheme)}
          >
            {THEME_OPTIONS.map(({ value, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon className="size-4" />
                <span>{t(value)}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  )
}
