import { ITransactionDetail } from "@/features/transaction/lib/queries/get-transaction-detail"
import formatCurrency from "@/shared/helper/format-currency"
import DetailRow from "./detail-row"
import formatDate, { formatDateTime } from "@/shared/helper/format-date"
import DeleteTransactionButton from "./delete-transaction-button"
import EditTransactionButton from "./edit-transaction-button"
import { cn } from "@/shared/utils"
import { getLocale, getTranslations } from "next-intl/server"

interface Props {
  transaction: ITransactionDetail
  currency: string
}

export default async function TransactionDetail({
  transaction,
  currency,
}: Props) {
  const locale = await getLocale()
  const t = await getTranslations("transaction")
  const isIncome = transaction.type === "income"

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* Amount hero */}
      <section className="flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 py-8">
        <span
          className="flex size-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: `${transaction.category.color}` }}
        >
          {transaction.category.icon}
        </span>

        <p
          className={cn(
            "text-3xl font-bold",
            isIncome ? "text-chart-2" : "text-destructive"
          )}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, currency)}
        </p>

        <p className="text-sm text-muted-foreground">
          {transaction.category.name}
        </p>
      </section>

      {/* Detail list */}
      <section className="flex flex-col divide-y divide-border rounded-2xl border">
        <DetailRow label={t("wallet")}>
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: transaction.wallet.color }}
            >
              {transaction.wallet.icon}
            </span>
            <span className="text-sm font-medium">
              {transaction.wallet.name}
            </span>
          </div>
        </DetailRow>

        <DetailRow label={t("category")}>
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: transaction.category.color }}
            >
              {transaction.category.icon}
            </span>
            <span className="text-sm font-medium">
              {transaction.category.name}
            </span>
          </div>
        </DetailRow>

        <DetailRow label={t("date")}>
          <span className="text-sm font-medium">
            {formatDate(transaction.transaction_date, locale)}
          </span>
        </DetailRow>

        <DetailRow label={t("type")}>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
              isIncome
                ? "bg-chart-2/10 text-chart-2"
                : "bg-primary/10 text-primary"
            )}
          >
            {transaction.type}
          </span>
        </DetailRow>
      </section>

      {/* Notes */}
      {transaction.notes && (
        <section className="flex flex-col gap-2 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {t("notes")}
          </p>
          <p className="text-sm">{transaction.notes}</p>
        </section>
      )}

      {/* Attachment */}
      {transaction.attachment_url && (
        <section className="flex flex-col gap-2 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {t("attachment")}
          </p>
          <a
            href={transaction.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="overflow-hidden rounded-xl border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={transaction.attachment_url}
              alt="Transaction attachment"
              className="h-48 w-full object-cover"
            />
          </a>
        </section>
      )}

      {/* Meta info */}
      <section className="flex flex-col gap-1 px-1 text-xs text-muted-foreground">
        <p>
          {t("created")} {formatDateTime(transaction.created_at, locale)}
        </p>
        {transaction.updated_at !== transaction.created_at && (
          <p>
            {t("updated")} {formatDateTime(transaction.updated_at, locale)}
          </p>
        )}
      </section>

      {/* Actions */}
      <section className="flex gap-2">
        <DeleteTransactionButton transactionId={transaction.id} />
        <EditTransactionButton transaction={transaction} />
      </section>
    </main>
  )
}
