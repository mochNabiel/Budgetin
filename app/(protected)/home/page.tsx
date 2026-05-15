import { Metadata } from "next"

import { Header } from "./header"
import StatsSection from "./stats-section"
import Allocation from "./allocation"
import FinancialTrend from "./financial-trend"
import AiInsight from "./ai-insight"
import RecentTransactions from "./recent-transactions"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default function Page() {
  return (
    <div className="w-full p-2">
      <Header />
      <main className="space-y-4">
        <StatsSection />
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <FinancialTrend />
          <AiInsight />
          <RecentTransactions />
          <Allocation />
        </div>
      </main>
    </div>
  )
}
