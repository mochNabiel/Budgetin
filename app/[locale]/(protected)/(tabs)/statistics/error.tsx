"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function StatisticsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("statistics")
  return <div className="mx-auto mt-4 max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm" role="alert"><p>{t("error")}</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={reset}>{t("retry")}</Button></div>
}
