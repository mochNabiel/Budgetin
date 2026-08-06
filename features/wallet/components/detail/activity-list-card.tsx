import { Card, CardContent } from "@/components/ui/card"
import type { WalletActivityItem } from "../../lib/queries/get-wallet-activity"
import type { IWalletTransactionActivity, IWalletTransferActivity } from "../../lib/queries/get-wallet-activity"
import ActivityEmptyState from "./activity-empty-state"
import ActivityTransactionRow from "./activity-transaction-row"
import ActivityTransferRow from "./activity-transfer-row"

type Props = {
  items: WalletActivityItem[]
  emptyMessage: string
  currency: string
  locale: string
}

export default function ActivityListCard({
  items,
  emptyMessage,
  currency,
  locale,
}: Props) {
  if (items.length === 0) {
    return <ActivityEmptyState message={emptyMessage} />
  }

  return (
    <Card size="sm" className="data-[size=sm]:py-0">
      <CardContent className="divide-y divide-border/60">
        {items.map((item) =>
          item.item_type === "transaction" ? (
            <ActivityTransactionRow
              key={`transaction-${item.id}`}
              item={item as IWalletTransactionActivity}
              currency={currency}
              locale={locale}
            />
          ) : (
            <ActivityTransferRow
              key={`transfer-${item.id}`}
              item={item as IWalletTransferActivity}
              currency={currency}
              locale={locale}
            />
          )
        )}
      </CardContent>
    </Card>
  )
}

