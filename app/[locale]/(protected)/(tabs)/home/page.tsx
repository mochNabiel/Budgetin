import { Metadata } from "next"

import { Header } from "@/features/home/components/header"

import StatsSection from "@/features/home/components/stats-section"
import WalletsSection from "@/features/home/components/wallets-section"
import RecentTransactionsSection from "@/features/home/components/recent-transactions-section"
import ActionSection from "@/features/home/components/action-section"
import RecentTransfersSection from "@/features/home/components/recent-transfer-section"
import { Suspense } from "react"
import { BalanceSkeleton, HeaderSkeleton, SectionSkeleton } from "./skeleton"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default async function Page() {
  return (
    <div className="mb-20 w-full p-2">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="space-y-4">
        <Suspense fallback={<BalanceSkeleton />}>
          <StatsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ActionSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WalletsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RecentTransactionsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RecentTransfersSection />
        </Suspense>
      </div>
    </div>
  )
}
