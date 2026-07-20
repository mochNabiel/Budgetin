import { notFound } from "next/navigation"
import { getUserData } from "@/features/auth/lib/queries"
import { getTransactionDetail } from "@/features/transaction/lib/queries/get-transaction-detail"
import { getTranslations } from "next-intl/server"
import PageHeader from "@/components/global/page-header"
import TransactionDetail from "@/features/transaction/components/detail/transaction-detail"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Transaction Detail",
  description: "Transaction Detail",
}

export default async function TransactionDetailPage({ params }: PageProps) {
  const { id } = await params

  const t = await getTranslations("transaction")

  const { currency } = await getUserData()

  let transaction
  try {
    transaction = await getTransactionDetail(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <PageHeader title={t("detail.header_title")} backHref="/transaction" />

      <TransactionDetail transaction={transaction} currency={currency} />
    </div>
  )
}
