import { Header } from "./header"
import { StatsSection } from "./stats-section"
import { SpendingOverview } from "./spending-overview"
import { SpendingTrend } from "./spending-trend"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budgetin - Home",
  description: "Home",
}

export default function Page() {
  return (
    <div className="w-full space-y-4">
      <Header />
      <main className="space-y-4">
        <StatsSection />
        <section className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          <SpendingOverview />
          <SpendingTrend />
        </section>
      </main>
    </div>
  )
}
