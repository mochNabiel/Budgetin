import { Metadata } from "next"

import { Header } from "./_components/header"
import StatsSection from "./_components/stats-section"
import Allocation from "./_components/allocation"
import FinancialTrend from "./_components/financial-trend"
import AiInsight from "./_components/ai-insight"
import RecentTransactions from "./_components/recent-transactions"
import { TransactionSheet } from "@/components/transaction/transaction-sheet"

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
        <TransactionSheet />
      </main>
    </div>
  )
}
