import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import TransferFilterDialog from "@/features/transfer/components/history/transfer-filter-dialog"
import TransferList from "@/features/transfer/components/history/transfer-list"
import { getTransfers } from "@/features/transfer/lib/queries/get-transfers"

interface PageProps {
  searchParams: Promise<{
    from?: string
    to?: string
  }>
}

export const metadata: Metadata = {
  title: "Budgetin - Transfer History",
  description: "Transfer History",
}

export default async function TransferPage({ searchParams }: PageProps) {
  const t = await getTranslations("transfer")
  const sp = await searchParams
  const transfers = await getTransfers({ from: sp.from, to: sp.to })

  return (
    <div>
      <PageHeader
        title={t("history.header_title")}
        backHref="/home"
        right={<TransferFilterDialog currentFilters={sp} />}
      />

      <main className="p-2">
        <TransferList transfers={transfers} />
      </main>
    </div>
  )
}
