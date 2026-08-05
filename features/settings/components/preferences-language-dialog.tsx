"use client"

import { Check, ChevronRight, Globe } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { usePathname, useRouter } from "@/i18n/navigation"
import { locales } from "@/constants/locales"
import { cn } from "@/shared/utils"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PreferencesLanguageDialog({
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations("settings.preferences")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = locale

  const selectedLanguage = locales.find((item) => item.value === currentLocale)

  function handleSelect(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/40"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600">
            <Globe className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{t("language")}</p>
            <p className="text-sm text-muted-foreground">
              {selectedLanguage?.label}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("select_language")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {locales.map((item) => {
            const selected = item.value === currentLocale
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-lg">
                  {item.flag}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.label}</p>
                </div>
                {selected && <Check className="size-4 text-primary" />}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
