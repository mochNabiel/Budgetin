import { Metadata } from "next"

import AccountPlanCard from "@/features/settings/components/account-plan-card"
import PreferencesCard from "@/features/settings/components/preferences-card"
import DangerZoneCard from "@/features/settings/components/danger-zone-card"
import { SectionHeader } from "@/components/global/section-header"

export const metadata: Metadata = {
  title: "Budgetin - Settings",
  description: "Settings",
}

export default async function SettingsPage() {
  return (
    <main className="space-y-4 px-4 py-6 pb-28">
      <section className="space-y-3">
        <SectionHeader title="Account & Plan" />
        <AccountPlanCard />
      </section>

      <section className="space-y-3">
        <SectionHeader title="Preferences" />
        <PreferencesCard />
      </section>

      <section className="space-y-3">
        <SectionHeader title="Danger Zone" />
        <DangerZoneCard />
      </section>
    </main>
  )
}
