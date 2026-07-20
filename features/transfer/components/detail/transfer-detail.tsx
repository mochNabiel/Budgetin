import { getLocale, getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import formatCurrency from "@/shared/helper/format-currency"
import formatDate, { formatDateTime } from "@/shared/helper/format-date"
import { getUserData } from "@/features/auth/lib/queries"
import { ITransferDetail } from "@/features/transfer/lib/queries/get-transfers"
import DetailRow from "./detail-row"
import DeleteTransferButton from "./delete-transfer-button"

interface Props {
  transfer: ITransferDetail
}

export default async function TransferDetail({ transfer }: Props) {
  const locale = await getLocale()
  const t = await getTranslations("transfer")
  const { currency } = await getUserData()

  return (
    <main className="flex flex-col gap-4 p-4">
      <section className="flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 py-8">
        <div className="flex items-center gap-3">
          <span
            className="flex size-14 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: transfer.from_wallet.color }}
          >
            {transfer.from_wallet.icon}
          </span>
          <ArrowRight className="size-5 text-muted-foreground" />
          <span
            className="flex size-14 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: transfer.to_wallet.color }}
          >
            {transfer.to_wallet.icon}
          </span>
        </div>

        <p className="text-3xl font-bold text-foreground">
          {formatCurrency(transfer.amount, currency)}
        </p>

        <p className="text-sm text-muted-foreground">
          {transfer.from_wallet.name} {"->"} {transfer.to_wallet.name}
        </p>
      </section>

      <section className="flex flex-col divide-y divide-border rounded-2xl border">
        <DetailRow label={t("from_wallet")}>
          <span className="text-sm font-medium">{transfer.from_wallet.name}</span>
        </DetailRow>
        <DetailRow label={t("to_wallet")}>
          <span className="text-sm font-medium">{transfer.to_wallet.name}</span>
        </DetailRow>
        <DetailRow label={t("date")}>
          <span className="text-sm font-medium">
            {formatDate(transfer.transfer_date, locale)}
          </span>
        </DetailRow>
      </section>

      {transfer.notes && (
        <section className="flex flex-col gap-2 rounded-2xl border p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {t("notes")}
          </p>
          <p className="text-sm">{transfer.notes}</p>
        </section>
      )}

      <section className="flex flex-col gap-1 px-1 text-xs text-muted-foreground">
        <p>
          {t("created")} {formatDateTime(transfer.created_at, locale)}
        </p>
        {transfer.updated_at !== transfer.created_at && (
          <p>
            {t("updated")} {formatDateTime(transfer.updated_at, locale)}
          </p>
        )}
      </section>

      <section className="flex gap-2">
        <DeleteTransferButton transferId={transfer.id} />
      </section>
    </main>
  )
}
