"use client"

import { useEffect, useState, useTransition } from "react"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import {
  Check,
  ChevronRight,
  Coins,
  Globe,
  MoonStar,
  SunMedium,
  Tag,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { locales } from "@/constants/locales"
import { CURRENCIES } from "@/constants/currencies"
import { getCurrencySymbol } from "@/shared/helper/format-currency"
import { updateCurrency } from "@/features/settings/lib/actions/update-currency"
import { cn } from "@/shared/utils"
import { useUser } from "@/components/global/user-provider"

type ThemeOption = "system" | "light" | "dark"

export default function PreferencesCard() {
  const user = useUser()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currentCurrency =
    CURRENCIES.find((currency) => currency.code === user.currency) ??
    CURRENCIES[0]

  const currentTheme = (theme ?? "system") as ThemeOption

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  function handleLanguageChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale })
  }

  function handleCurrencyChange(currencyCode: string) {
    startTransition(async () => {
      const result = await updateCurrency(currencyCode)

      if (!result.success) {
        toast.error(result.message ?? "Failed to update currency")
        return
      }

      toast.success("Currency updated")
      setCurrencyOpen(false)
      router.refresh()
    })
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-background">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/40"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600">
              <Globe className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Language</p>
              <p className="text-sm text-muted-foreground">
                {locales.find((item) => item.value === locale)?.label}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={handleLanguageChange}
          >
            {locales.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                <div className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 border-t px-4 py-4 text-left transition-colors hover:bg-muted/40"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
              <Coins className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Currency</p>
              <p className="text-sm text-muted-foreground">
                {currentCurrency.code} - {currentCurrency.name}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select currency</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {CURRENCIES.map((currency) => {
              const selected = currency.code === currentCurrency.code
              return (
                <button
                  key={currency.code}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-sm font-semibold">
                    {getCurrencySymbol(currency.code)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{currency.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {currency.name}
                    </p>
                  </div>
                  {selected && <Check className="size-4 text-primary" />}
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-3 border-t px-4 py-4">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
          <SunMedium className="size-5 dark:hidden" />
          <MoonStar className="hidden size-5 dark:block" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Theme</p>
          <p className="text-sm text-muted-foreground capitalize">
            {mounted ? currentTheme : "system"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
          {(["system", "light", "dark"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              variant={mounted && currentTheme === option ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 capitalize"
              onClick={() => setTheme(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/category")}
        className="flex w-full items-center gap-3 border-t px-4 py-4 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600">
          <Tag className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Customize Category</p>
          <p className="text-sm text-muted-foreground">
            Edit, add, or remove categories
          </p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>

      <button
        type="button"
        onClick={() => router.push("/wallet")}
        className="flex w-full items-center gap-3 border-t px-4 py-4 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <Wallet className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Customize Wallet</p>
          <p className="text-sm text-muted-foreground">Manage your wallets</p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>
    </div>
  )
}
