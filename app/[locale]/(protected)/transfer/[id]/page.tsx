import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import PageHeader from "@/components/global/page-header"
import TransferDetail from "@/features/transfer/components/detail/transfer-detail"
import {
  getTransferDetail,
  type ITransferDetail,
} from "@/features/transfer/lib/queries/get-transfers"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Budgetin - Transfer Detail",
  description: "Transfer Detail",
}

export default async function TransferDetailPage({ params }: PageProps) {
  const { id } = await params
  const t = await getTranslations("transfer")

  let transfer: ITransferDetail
  try {
    transfer = await getTransferDetail(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <PageHeader title={t("detail.header_title")} backHref="/home" />
      <TransferDetail transfer={transfer} />
    </div>
  )
}
