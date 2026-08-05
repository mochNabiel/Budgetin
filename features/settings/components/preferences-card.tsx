"use client"

import { useState } from "react"
import { Tag, Wallet } from "lucide-react"
import { useTranslations } from "next-intl"

import { useRouter } from "@/i18n/navigation"

import PreferencesCurrencyDialog from "@/features/settings/components/preferences-currency-dialog"
import PreferencesLanguageDialog from "@/features/settings/components/preferences-language-dialog"
import PreferencesThemeSection from "@/features/settings/components/preferences-theme-section"

export default function PreferencesCard() {
  const t = useTranslations("settings.preferences")
  const router = useRouter()
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-3xl border bg-background">
      <PreferencesLanguageDialog
        open={languageOpen}
        onOpenChange={setLanguageOpen}
      />

      <PreferencesCurrencyDialog
        open={currencyOpen}
        onOpenChange={setCurrencyOpen}
      />

      <PreferencesThemeSection />

      <button
        type="button"
        onClick={() => router.push("/category")}
        className="flex w-full items-center gap-3 border-t px-4 py-4 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600">
          <Tag className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{t("customize_category")}</p>
          <p className="text-sm text-muted-foreground">
            {t("customize_category_description")}
          </p>
        </div>
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
          <p className="font-medium">{t("customize_wallet")}</p>
          <p className="text-sm text-muted-foreground">
            {t("customize_wallet_description")}
          </p>
        </div>
      </button>
    </div>
  )
}
