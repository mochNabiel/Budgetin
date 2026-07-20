import { Metadata } from "next"

import { Header } from "@/features/home/components/header"

import StatsSection from "@/features/home/components/stats-section"
import WalletsSection from "@/features/home/components/wallets-section"
import RecentTransactionsSection from "@/features/home/components/recent-transactions-section"
import ActionSection from "@/features/home/components/action-section"
import RecentTransfersSection from "@/features/home/components/recent-transfer-section"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default async function Page() {
  return (
    <div className="mb-20 w-full p-2">
      <Header />
      <div className="space-y-4">
        <StatsSection />
        <ActionSection />
        <WalletsSection />
        <RecentTransactionsSection />
        <RecentTransfersSection />
      </div>
    </div>
  )
}
