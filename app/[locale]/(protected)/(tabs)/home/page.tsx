import { Metadata } from "next"

import { Header } from "@/features/home/components/header"

import { getWallets } from "@/features/wallet/lib/queries"
import StatsSection from "@/features/home/components/stats-section"
import WalletsSection from "@/features/home/components/wallets-section"
import RecentTransactionsSection from "@/features/home/components/recent-transactions-section"
import ActionSection from "@/features/home/components/action-section"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default async function Page() {
  const wallets = await getWallets()

  return (
    <div className="mb-20 w-full p-2">
      <Header />
      <div className="space-y-4">
        <StatsSection />
        <ActionSection />
        <WalletsSection wallets={wallets ?? []} />
        <RecentTransactionsSection />
      </div>
    </div>
  )
}
