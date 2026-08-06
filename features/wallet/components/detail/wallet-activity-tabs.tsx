import { getTranslations } from "next-intl/server"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WalletActivityItem } from "../../lib/queries/get-wallet-activity"
import ActivityListCard from "./activity-list-card"

interface Props {
  activity: WalletActivityItem[]
  currency: string
  locale: string
}

export default async function WalletActivityTabs({
  activity,
  currency,
  locale,
}: Props) {
  const t = await getTranslations("wallet.detail")

  const transactions = activity.filter(
    (item): item is WalletActivityItem & { item_type: "transaction" } =>
      item.item_type === "transaction"
  )

  const transfers = activity.filter(
    (item): item is WalletActivityItem & { item_type: "transfer" } =>
      item.item_type === "transfer"
  )

  return (
    <section className="mb-10">
      <Tabs defaultValue="all" className="w-full rounded-xl">
        <TabsList className="w-full rounded-xl py-6">
          <TabsTrigger value="all" className="flex-1 py-5">
            {t("all")}
          </TabsTrigger>
          <TabsTrigger value="transaction" className="flex-1 py-5">
            {t("transaction")}
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex-1 py-5">
            {t("transfer")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-3">
          <ActivityListCard
            items={activity}
            emptyMessage={t("no_activity")}
            currency={currency}
            locale={locale}
          />
        </TabsContent>

        <TabsContent value="transaction" className="mt-3">
          <ActivityListCard
            items={transactions}
            emptyMessage={t("no_activity")}
            currency={currency}
            locale={locale}
          />
        </TabsContent>

        <TabsContent value="transfer" className="mt-3">
          <ActivityListCard
            items={transfers}
            emptyMessage={t("no_activity")}
            currency={currency}
            locale={locale}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
