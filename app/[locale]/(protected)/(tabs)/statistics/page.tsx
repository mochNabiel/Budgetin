import { Metadata } from "next"
import { Suspense } from "react"
import { getLocale, getTranslations } from "next-intl/server"
import StatisticsClient, { StatisticsLoading } from "@/features/statistics/components/statistics-client"
import { getStatistics, resolveStatisticsPeriod, type PeriodPreset } from "@/features/statistics/lib/statistics"

export const metadata: Metadata = {
  title: "Budgetin - Statistics",
  description: "Statistics",
}


type Props = { searchParams: Promise<{ period?: string; from?: string; to?: string }> }

async function StatisticsContent({ searchParams }: Props) {
  const [params, locale] = await Promise.all([searchParams, getLocale()])
  const validPresets: PeriodPreset[] = ["this-month", "last-month", "last-3-months", "custom"]
  const preset = validPresets.includes(params.period as PeriodPreset) ? params.period as PeriodPreset : "this-month"
  const period = resolveStatisticsPeriod(preset, params.from, params.to)
  let data
  try {
    data = await getStatistics(period)
  } catch {
    const t = await getTranslations("statistics")
    return <div className="m-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive" role="alert">{t("error")}</div>
  }
  return <StatisticsClient data={data} locale={locale}/>
}

export default function Page({ searchParams }: Props) {
  return <Suspense fallback={<StatisticsLoading/>}><StatisticsContent searchParams={searchParams}/></Suspense>
}
