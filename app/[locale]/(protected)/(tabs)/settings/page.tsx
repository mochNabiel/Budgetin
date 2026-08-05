import { Metadata } from "next"

import AccountPlanCard from "@/features/settings/components/account-plan-card"
import PreferencesCard from "@/features/settings/components/preferences-card"
import DangerZoneCard from "@/features/settings/components/danger-zone-card"
import { SectionHeader } from "@/components/global/section-header"
import PageHeader from "@/components/global/page-header"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Budgetin - Settings",
  description: "Settings",
}

export default async function SettingsPage() {
  const t = await getTranslations("settings")
  return (
    <div>
      <PageHeader title={t("title")} />
      <main className="space-y-4 px-4 pb-28">
        <section>
          <SectionHeader title={t("account_plan.title")} />
          <AccountPlanCard />
        </section>

        <section>
          <SectionHeader title={t("preferences.title")} />
          <PreferencesCard />
        </section>

        <section>
          <SectionHeader title={t("danger_zone.title")} />
          <DangerZoneCard />
        </section>
      </main>
    </div>
  )
}
