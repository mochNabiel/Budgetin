"use client"

import { useLocale } from "next-intl"

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

import { locales } from "@/constants/locales"
import { usePathname, useRouter } from "@/i18n/navigation"

export default function LocaleToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Toggle language">
              <span className="text-sm leading-none">
                {locales.find((item) => item.value === locale)?.flag ?? "🌐"}
              </span>
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Change language</TooltipContent>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(nextLocale) => {
              router.replace(pathname, { locale: nextLocale })
              router.refresh()
            }}
          >
            {locales.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                <span className="text-base leading-none">{item.flag}</span>
                <span>{item.label}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  )
}
