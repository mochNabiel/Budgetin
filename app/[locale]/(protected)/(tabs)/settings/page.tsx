import { Metadata } from "next"

import AccountPlanCard from "@/features/settings/components/account-plan-card"
import PreferencesCard from "@/features/settings/components/preferences-card"
import DangerZoneCard from "@/features/settings/components/danger-zone-card"
import { SectionHeader } from "@/components/global/section-header"
import PageHeader from "@/components/global/page-header"

export const metadata: Metadata = {
  title: "Budgetin - Settings",
  description: "Settings",
}

export default async function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />
      <main className="space-y-4 px-4 pb-28">
        <section>
          <SectionHeader title="Account & Plan" />
          <AccountPlanCard />
        </section>

        <section>
          <SectionHeader title="Preferences" />
          <PreferencesCard />
        </section>

        <section>
          <SectionHeader title="Danger Zone" />
          <DangerZoneCard />
        </section>
      </main>
    </div>
  )
}
