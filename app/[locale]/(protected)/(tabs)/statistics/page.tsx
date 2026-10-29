import { Metadata } from "next"
import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import StatisticsClient, { StatisticsLoading } from "@/features/statistics/components/statistics-client"
import { getStatistics, type Range } from "@/features/statistics/lib/statistics"

export const metadata: Metadata = {
  title: "Budgetin - Statistics",
  description: "Statistics",
}


type Props = { searchParams: Promise<{ range?: string; wallet?: string }> }

async function StatisticsContent({ searchParams }: Props) {
  const params = await searchParams
  const range: Range = ["1m", "6m", "12m", "all"].includes(params.range ?? "") ? params.range as Range : "6m"
  const t = await getTranslations("statistics")
  const data = await getStatistics(range, params.wallet ?? "all", t("category.uncategorized"))
  return <StatisticsClient data={data}/>
}

export default function Page({ searchParams }: Props) {
  return <Suspense fallback={<StatisticsLoading/>}><StatisticsContent searchParams={searchParams}/></Suspense>
}
